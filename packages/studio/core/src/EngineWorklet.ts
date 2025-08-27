/**
 * Engine implementation running inside an audio worklet context.
 */
import {
  Arrays,
  byte,
  DefaultObservableValue,
  int,
  MutableObservableValue,
  Notifier,
  Nullable,
  ObservableValue,
  Observer,
  Option,
  Subscription,
  SyncStream,
  Terminator,
  unitValue,
  UUID,
} from "@opendaw/lib-std";
import { ppqn } from "@opendaw/lib-dsp";
import { SyncSource } from "@opendaw/lib-box";
import { AnimationFrame } from "@opendaw/lib-dom";
import { Communicator, Messenger } from "@opendaw/lib-runtime";
import {
  AudioData,
  ClipNotification,
  ClipSequencingUpdates,
  EngineCommands,
  EngineProcessorOptions,
  EngineState,
  EngineStateSchema,
  EngineToClient,
  ExportStemsConfiguration,
} from "@opendaw/studio-adapters";
import { BoxIO } from "@opendaw/studio-boxes";
import { Project } from "./Project";
import { Engine, NoteTrigger } from "./Engine";

/**
 * Wrapper around the engine audio worklet processor.
 *
 * The worklet communicates with both the main thread and the shared worker
 * using {@link Messenger} channels. Heavy operations such as file access or
 * waveform analysis are delegated to worker agents while audio rendering
 * stays within the audio worklet context.
 *
 * Error Handling: initialization failures reject the {@link isReady} promise
 * and must be handled by callers awaiting engine readiness.
 */
export class EngineWorklet extends AudioWorkletNode implements Engine {
  /** Monotonic identifier assigned to each worklet instance. */
  static ID: int = 0 | 0;

  /** Unique id of this worklet instance. */
  readonly id = EngineWorklet.ID++;

  readonly #terminator: Terminator = new Terminator();

  readonly #project: Project;
  readonly #playbackTimestamp: DefaultObservableValue<ppqn> =
    new DefaultObservableValue(0.0);
  readonly #position: DefaultObservableValue<ppqn> = new DefaultObservableValue(
    0.0,
  );
  readonly #isPlaying: DefaultObservableValue<boolean> =
    new DefaultObservableValue(false);
  readonly #isRecording: DefaultObservableValue<boolean> =
    new DefaultObservableValue(false);
  readonly #isCountingIn: DefaultObservableValue<boolean> =
    new DefaultObservableValue(false);
  readonly #countInBeatsTotal: DefaultObservableValue<int> =
    new DefaultObservableValue(4);
  readonly #countInBeatsRemaining: DefaultObservableValue<int> =
    new DefaultObservableValue(0);
  readonly #metronomeEnabled: DefaultObservableValue<boolean> =
    new DefaultObservableValue(false);
  readonly #markerState: DefaultObservableValue<Nullable<[UUID.Format, int]>> =
    new DefaultObservableValue<Nullable<[UUID.Format, int]>>(null);
  readonly #notifyClipNotification: Notifier<ClipNotification>;
  readonly #notifyNoteTrigger: Notifier<NoteTrigger>;
  readonly #playingClips: Array<UUID.Format>;
  readonly #commands: EngineCommands;
  readonly #isReady: Promise<void>;

  /**
   * Creates a new engine worklet.
   *
   * @param context - The audio context to attach to.
   * @param project - Project data to initialize the engine with.
   * @param exportConfiguration - Optional stem export configuration.
   */
  constructor(
    context: BaseAudioContext,
    project: Project,
    exportConfiguration?: ExportStemsConfiguration,
  ) {
    const numberOfChannels =
      ExportStemsConfiguration.countStems(Option.wrap(exportConfiguration)) * 2;
    const reader = SyncStream.reader<EngineState>(
      EngineStateSchema(),
      (state) => {
        this.#isPlaying.setValue(state.isPlaying);
        this.#isRecording.setValue(state.isRecording);
        this.#isCountingIn.setValue(state.isCountingIn);
        this.#countInBeatsTotal.setValue(state.countInBeatsTotal);
        this.#countInBeatsRemaining.setValue(state.countInBeatsRemaining);
        this.#playbackTimestamp.setValue(state.playbackTimestamp);
        this.#position.setValue(state.position); // This must be the last to handle the state values before
      },
    );

    super(context, "engine-processor", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [numberOfChannels],
      processorOptions: {
        sab: reader.buffer,
        project: project.toArrayBuffer(),
        exportConfiguration,
      } satisfies EngineProcessorOptions,
    });

    const { resolve, promise } = Promise.withResolvers<void>();
    const messenger = Messenger.for(this.port);
    this.#project = project;
    this.#isReady = promise;
    this.#notifyClipNotification = this.#terminator.own(
      new Notifier<ClipNotification>(),
    );
    this.#notifyNoteTrigger = this.#terminator.own(new Notifier<NoteTrigger>());
    this.#playingClips = [];
    this.#commands = this.#terminator.own(
      Communicator.sender<EngineCommands>(
        messenger.channel("engine-commands"),
        (dispatcher) =>
          new (class implements EngineCommands {
            play(): void {
              dispatcher.dispatchAndForget(this.play);
            }
            stop(reset: boolean): void {
              dispatcher.dispatchAndForget(this.stop, reset);
            }
            setPosition(position: number): void {
              dispatcher.dispatchAndForget(this.setPosition, position);
            }
            startRecording(countIn: boolean) {
              dispatcher.dispatchAndForget(this.startRecording, countIn);
            }
            stopRecording() {
              dispatcher.dispatchAndForget(this.stopRecording);
            }
            setMetronomeEnabled(enabled: boolean): void {
              dispatcher.dispatchAndForget(this.setMetronomeEnabled, enabled);
            }
            queryLoadingComplete(): Promise<boolean> {
              return dispatcher.dispatchAndReturn(this.queryLoadingComplete);
            }
            panic(): void {
              dispatcher.dispatchAndForget(this.panic);
            }
            noteOn(uuid: UUID.Format, pitch: byte, velocity: unitValue): void {
              dispatcher.dispatchAndForget(this.noteOn, uuid, pitch, velocity);
            }
            noteOff(uuid: UUID.Format, pitch: byte): void {
              dispatcher.dispatchAndForget(this.noteOff, uuid, pitch);
            }
            scheduleClipPlay(clipIds: ReadonlyArray<UUID.Format>): void {
              dispatcher.dispatchAndForget(this.scheduleClipPlay, clipIds);
            }
            scheduleClipStop(trackIds: ReadonlyArray<UUID.Format>): void {
              dispatcher.dispatchAndForget(this.scheduleClipStop, trackIds);
            }
            terminate(): void {
              dispatcher.dispatchAndForget(this.terminate);
            }
          })(),
      ),
    );
    Communicator.executor<EngineToClient>(
      messenger.channel("engine-to-client"),
      {
        log: (message: string): void => console.log("WORKLET", message),
        ready: (): void => resolve(),
        fetchAudio: (uuid: UUID.Format): Promise<AudioData> => {
          return new Promise((resolve, reject) => {
            const handler = project.sampleManager.getOrCreate(uuid);
            handler.subscribe((state) => {
              if (state.type === "error") {
                reject(state.reason);
              } else if (state.type === "loaded") {
                resolve(handler.data.unwrap());
              }
            });
          });
        },
        notifyClipSequenceChanges: (changes: ClipSequencingUpdates): void => {
          changes.stopped.forEach((uuid) => {
            for (let i = 0; i < this.#playingClips.length; i++) {
              if (UUID.equals(this.#playingClips[i], uuid)) {
                this.#playingClips.splice(i, 1);
                break;
              }
            }
          });
          changes.started.forEach((uuid) => this.#playingClips.push(uuid));
          this.#notifyClipNotification.notify({ type: "sequencing", changes });
        },
        switchMarkerState: (state: Nullable<[UUID.Format, int]>): void =>
          this.#markerState.setValue(state),
      } satisfies EngineToClient,
    );
    this.#terminator.ownAll(
      AnimationFrame.add(() => reader.tryRead()),
      project.liveStreamReceiver.connect(messenger.channel("engine-live-data")),
      new SyncSource<BoxIO.TypeMap>(
        project.boxGraph,
        messenger.channel("engine-sync"),
        false,
      ),
      this.#metronomeEnabled.catchupAndSubscribe((owner) =>
        this.#commands.setMetronomeEnabled(owner.getValue()),
      ),
    );
  }

  /** Starts playback. */
  play(): void {
    this.#commands.play();
  }
  /** Stops playback optionally resetting the transport. */
  stop(reset: boolean = false): void {
    this.#commands.stop(reset);
  }
  /** Sets the playback position in pulses per quarter note. */
  setPosition(position: ppqn): void {
    this.#commands.setPosition(position);
  }
  /** Begins recording; optionally count in before starting. */
  startRecording(countIn: boolean): void {
    this.#commands.startRecording(countIn);
  }
  /** Stops the current recording session. */
  stopRecording(): void {
    this.#commands.stopRecording();
  }
  /** Immediately silences the engine. */
  panic(): void {
    this.#commands.panic();
  }

  /** Observable playback state. */
  get isPlaying(): ObservableValue<boolean> {
    return this.#isPlaying;
  }
  /** True while the engine is recording. */
  get isRecording(): ObservableValue<boolean> {
    return this.#isRecording;
  }
  /** Indicates that the engine is counting in before recording. */
  get isCountingIn(): ObservableValue<boolean> {
    return this.#isCountingIn;
  }
  /** Total number of beats to count in before playback starts. */
  get countInBeatsTotal(): ObservableValue<int> {
    return this.#countInBeatsTotal;
  }
  /** Remaining beats of the active count in. */
  get countInBeatsRemaining(): ObservableValue<number> {
    return this.#countInBeatsRemaining;
  }
  /** Current transport position in pulses per quarter note. */
  get position(): ObservableValue<ppqn> {
    return this.#position;
  }
  /** Timestamp reported by the processor used for syncing. */
  get playbackTimestamp(): MutableObservableValue<number> {
    return this.#playbackTimestamp;
  }
  /** Enables or disables the metronome. */
  get metronomeEnabled(): MutableObservableValue<boolean> {
    return this.#metronomeEnabled;
  }
  /** Currently active marker or `null` if none. */
  get markerState(): ObservableValue<Nullable<[UUID.Format, int]>> {
    return this.#markerState;
  }
  /** Project instance the engine operates on. */
  get project(): Project {
    return this.#project;
  }

  /** Resolves once the processor has finished its initialization. */
  isReady(): Promise<void> {
    return this.#isReady;
  }
  /** Queries whether all resources have been loaded. */
  queryLoadingComplete(): Promise<boolean> {
    return this.#commands.queryLoadingComplete();
  }
  /** Sends a note-on event to the engine and notifies observers. */
  noteOn(uuid: UUID.Format, pitch: byte, velocity: unitValue): void {
    this.#commands.noteOn(uuid, pitch, velocity);
    this.#notifyNoteTrigger.notify({ type: "note-on", uuid, pitch, velocity });
  }
  /** Sends a note-off event to the engine and notifies observers. */
  noteOff(uuid: UUID.Format, pitch: byte): void {
    this.#commands.noteOff(uuid, pitch);
    this.#notifyNoteTrigger.notify({ type: "note-off", uuid, pitch });
  }
  /** Subscribes to note trigger events emitted by the engine. */
  subscribeNotes(observer: Observer<NoteTrigger>): Subscription {
    return this.#notifyNoteTrigger.subscribe(observer);
  }
  /** Schedules clips to start playing. */
  scheduleClipPlay(clipIds: ReadonlyArray<UUID.Format>): void {
    this.#notifyClipNotification.notify({ type: "waiting", clips: clipIds });
    this.#commands.scheduleClipPlay(clipIds);
  }
  /** Stops scheduled clips for the specified tracks. */
  scheduleClipStop(trackIds: ReadonlyArray<UUID.Format>): void {
    this.#commands.scheduleClipStop(trackIds);
  }
  /** Subscribes to clip sequencing notifications. */
  subscribeClipNotification(
    observer: Observer<ClipNotification>,
  ): Subscription {
    observer({
      type: "sequencing",
      changes: {
        started: this.#playingClips,
        stopped: Arrays.empty(),
        obsolete: Arrays.empty(),
      },
    });
    return this.#notifyClipNotification.subscribe(observer);
  }

  /** Terminates the worklet and disconnects from the audio graph. */
  terminate(): void {
    this.#terminator.terminate();
    this.disconnect();
  }
}
