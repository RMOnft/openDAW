/**
 * High level wrapper around {@link EngineWorklet} for application code.
 */
import {
    byte,
    DefaultObservableValue,
    int,
    MutableObservableValue,
    Nullable,
    ObservableValue,
    Observer,
    Option,
    Subscription,
    Terminator,
    unitValue,
    UUID
} from "@opendaw/lib-std"
import {ppqn} from "@opendaw/lib-dsp"
import {ClipNotification} from "@opendaw/studio-adapters"
import {Engine, NoteTrigger} from "./Engine"
import {EngineWorklet} from "./EngineWorklet"
import {Project} from "./Project"

/**
 * High level wrapper around {@link EngineWorklet} that exposes observable
 * playback state and delegates engine commands.
 *
 * @public
 */
export class EngineFacade implements Engine {
    readonly #terminator: Terminator = new Terminator()
    readonly #lifecycle: Terminator = this.#terminator.own(new Terminator())
    readonly #playbackTimestamp: DefaultObservableValue<ppqn> = new DefaultObservableValue(0.0)
    readonly #countInBeatsTotal: DefaultObservableValue<int> = new DefaultObservableValue(4)
    readonly #countInBeatsRemaining: DefaultObservableValue<int> = new DefaultObservableValue(0)
    readonly #position: DefaultObservableValue<ppqn> = new DefaultObservableValue(0.0)
    readonly #isPlaying: DefaultObservableValue<boolean> = new DefaultObservableValue(false)
    readonly #isRecording: DefaultObservableValue<boolean> = new DefaultObservableValue(false)
    readonly #isCountingIn: DefaultObservableValue<boolean> = new DefaultObservableValue(false)
    readonly #metronomeEnabled: DefaultObservableValue<boolean> = new DefaultObservableValue(false)
    readonly #markerState: DefaultObservableValue<Nullable<[UUID.Format, int]>> =
        new DefaultObservableValue<Nullable<[UUID.Format, int]>>(null)

    #client: Option<EngineWorklet> = Option.None

    /** Creates an empty facade without an attached engine client. */
    constructor() {}

    /**
     * Connects to the underlying {@link EngineWorklet} instance.
     *
     * Wiring up a new client re-subscribes all observable properties to forward
     * state changes to the host application.
     *
     * @param client - Worklet instance to bind to this facade.
     */
    setClient(client: EngineWorklet) {
        this.#client = Option.wrap(client)
        this.#lifecycle.terminate()
        this.#lifecycle.ownAll(
            client.playbackTimestamp.catchupAndSubscribe(owner => this.#playbackTimestamp.setValue(owner.getValue())),
            client.countInBeatsTotal.catchupAndSubscribe(owner => this.#countInBeatsTotal.setValue(owner.getValue())),
            client.countInBeatsRemaining.catchupAndSubscribe(owner => this.#countInBeatsRemaining.setValue(owner.getValue())),
            client.position.catchupAndSubscribe(owner => this.#position.setValue(owner.getValue())),
            client.isPlaying.catchupAndSubscribe(owner => this.#isPlaying.setValue(owner.getValue())),
            client.isRecording.catchupAndSubscribe(owner => this.#isRecording.setValue(owner.getValue())),
            client.isCountingIn.catchupAndSubscribe(owner => this.#isCountingIn.setValue(owner.getValue())),
            client.metronomeEnabled.catchupAndSubscribe(owner => this.#metronomeEnabled.setValue(owner.getValue())),
            client.markerState.catchupAndSubscribe(owner => this.#markerState.setValue(owner.getValue())),
            this.metronomeEnabled.catchupAndSubscribe(owner => client.metronomeEnabled.setValue(owner.getValue()))
        )
    }

    /**
     * Detaches and terminates the currently connected {@link EngineWorklet}.
     * After calling this the facade returns to an idle state and can later be
     * attached to a new client.
     */
    releaseClient(): void {
        this.#lifecycle.terminate()
        this.#client.ifSome(client => client.terminate())
        this.#client = Option.None
    }

    /** Starts playback if a client is attached. */
    play(): void {this.#client.ifSome(client => client.play())}
    /** Stops playback; optionally resets the transport. */
    stop(reset: boolean = false): void {this.#client.ifSome(client => client.stop(reset))}
    /** Sets the playback position. */
    setPosition(position: ppqn): void {this.#client.ifSome(client => client.setPosition(position))}
    /** Begins recording; optionally performs a count-in. */
    startRecording(countIn: boolean): void {this.#client.ifSome(client => client.startRecording(countIn))}
    /** Stops recording if active. */
    stopRecording(): void {this.#client.ifSome(client => client.stopRecording())}

    get position(): ObservableValue<ppqn> {return this.#position}
    get isPlaying(): ObservableValue<boolean> {return this.#isPlaying}
    get isRecording(): ObservableValue<boolean> {return this.#isRecording}
    get isCountingIn(): ObservableValue<boolean> {return this.#isCountingIn}
    get metronomeEnabled(): MutableObservableValue<boolean> {return this.#metronomeEnabled}
    get playbackTimestamp(): ObservableValue<ppqn> {return this.#playbackTimestamp}
    get countInBeatsTotal(): ObservableValue<int> {return this.#countInBeatsTotal}
    get countInBeatsRemaining(): ObservableValue<int> {return this.#countInBeatsRemaining}
    get markerState(): DefaultObservableValue<Nullable<[UUID.Format, int]>> {return this.#markerState}
    /** Currently attached project instance. */
    get project(): Project {return this.#client.unwrap("No engine").project}

    /** Resolves once the underlying engine reports readiness. */
    isReady(): Promise<void> {return this.#client.mapOr(client => client.isReady(), Promise.resolve())}
    /** Queries whether the engine has finished loading resources. */
    queryLoadingComplete(): Promise<boolean> {
        return this.#client.mapOr(client => client.queryLoadingComplete(), Promise.resolve(false))
    }
    /** Sends an all-notes-off message to attached devices. */
    panic(): void {this.#client.ifSome(client => client.panic())}
    /** Sample rate of the audio context, or 44.1 kHz if no client is attached. */
    sampleRate(): number {return this.#client.isEmpty() ? 44_100 : this.#client.unwrap().context.sampleRate}
    /** Subscribes to clip sequencing notifications from the engine. */
    subscribeClipNotification(observer: Observer<ClipNotification>): Subscription {
        return this.#client.unwrap("No engine").subscribeClipNotification(observer)
    }
    /** Subscribes to note trigger events from the engine. */
    subscribeNotes(observer: Observer<NoteTrigger>): Subscription {
        return this.#client.unwrap("No engine").subscribeNotes(observer)
    }
    /** Sends a note-on event to a specific instrument. */
    noteOn(uuid: UUID.Format, pitch: byte, velocity: unitValue): void {
        this.#client.unwrap("No engine").noteOn(uuid, pitch, velocity)
    }
    /** Sends a note-off event to a specific instrument. */
    noteOff(uuid: UUID.Format, pitch: byte): void {this.#client.unwrap("No engine").noteOff(uuid, pitch)}
    /** Schedules clips for playback. */
    scheduleClipPlay(clipIds: ReadonlyArray<UUID.Format>): void {
        this.#client.unwrap("No engine").scheduleClipPlay(clipIds)
    }
    /** Cancels scheduled clip playback for the given tracks. */
    scheduleClipStop(trackIds: ReadonlyArray<UUID.Format>): void {
        this.#client.unwrap("No engine").scheduleClipStop(trackIds)
    }

    /** Releases resources held by the facade and its client. */
    terminate(): void {
        this.releaseClient()
        this.#terminator.terminate()
    }
}
