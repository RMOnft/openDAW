import {
  ArrayMultimap,
  DefaultObservableValue,
  EmptyExec,
  Option,
  Procedure,
  Subscription,
  unitValue,
  UUID,
} from "@opendaw/lib-std";
import { SampleApi } from "./SampleApi";
import { encodeWavFloat, SampleStorage } from "@opendaw/studio-core";

/** Events emitted by {@link SamplePlayback}. */
export type PlaybackEvent =
  | {
      type: "idle";
    }
  | {
      type: "buffering";
    }
  | {
      type: "playing";
    }
  | {
      type: "error";
      reason: string;
    };

/**
 * Lightweight preview player for samples. It handles buffering, playback and
 * emits state changes to subscribed UI components.
 *
 * ```mermaid
 * stateDiagram-v2
 *   [*] --> idle
 *   idle --> buffering
 *   buffering --> playing
 *   playing --> idle
 * ```
 */
export class SamplePlayback {
  readonly #context: AudioContext;
  readonly #audio: HTMLAudioElement;
  readonly #notifiers: ArrayMultimap<string, Procedure<PlaybackEvent>>;
  readonly #linearVolume: DefaultObservableValue<unitValue>;

  #current: Option<string> = Option.None;

  constructor(context: AudioContext) {
    this.#context = context;

    this.#audio = new Audio();
    this.#audio.crossOrigin = "use-credentials";
    this.#audio.preload = "auto";
    this.#notifiers = new ArrayMultimap<string, Procedure<PlaybackEvent>>();
    this.#linearVolume = new DefaultObservableValue<unitValue>(1.0);
    this.#linearVolume.catchupAndSubscribe(
      (owner) => (this.#audio.volume = owner.getValue()),
    ); // no owner needed
  }

  /**
   * Toggle playback of a given sample. If it is currently playing it will
   * stop, otherwise it will buffer and start playback.
   */
  toggle(uuidAsString: string): void {
    if (this.#current.contains(uuidAsString)) {
      if (this.#audio.paused) {
        this.#notify(uuidAsString, { type: "buffering" });
        this.#audio.play().catch(EmptyExec);
      } else {
        this.#audio.currentTime = 0.0;
        this.#audio.pause();
      }
    } else {
      this.#watchAudio(uuidAsString);
      this.#notify(uuidAsString, { type: "buffering" });

      SampleStorage.load(UUID.parse(uuidAsString), this.#context)
        .then(
          ([audio]) => {
            this.#audio.src = URL.createObjectURL(
              new Blob(
                [
                  encodeWavFloat({
                    channels: audio.frames.slice(),
                    sampleRate: audio.sampleRate,
                    numFrames: audio.numberOfFrames,
                  }),
                ],
                { type: "audio/wav" },
              ),
            );
          },
          () => {
            this.#audio.src = `${SampleApi.FileRoot}/${uuidAsString}`;
          },
        )
        .finally(() => this.#audio.play().catch(EmptyExec));

      this.#current.ifSome((uuid) => this.#notify(uuid, { type: "idle" }));
      this.#current = Option.wrap(uuidAsString);
    }
  }

  /** Stop playback and reset the internal state. */
  eject(): void {
    this.#current.ifSome((uuid) => this.#notify(uuid, { type: "idle" }));
    this.#current = Option.None;
    this.#audio.pause();
    this.#unwatchAudio();
  }

  /**
   * Subscribe to playback events for a particular sample.
   */
  subscribe(
    uuidAsString: string,
    procedure: Procedure<PlaybackEvent>,
  ): Subscription {
    this.#notifiers.add(uuidAsString, procedure);
    return { terminate: () => this.#notifiers.remove(uuidAsString, procedure) };
  }

  /** Observable linear volume for all preview playback. */
  get linearVolume(): DefaultObservableValue<number> {
    return this.#linearVolume;
  }

  /** Notify subscribers about a playback event. */
  #notify(uuidAsString: string, event: PlaybackEvent): void {
    this.#notifiers.get(uuidAsString).forEach((procedure) => procedure(event));
  }

  /** Attach listeners to the underlying {@link HTMLAudioElement}. */
  #watchAudio(uuidAsString: string): void {
    this.#audio.onended = () => this.#notify(uuidAsString, { type: "idle" });
    this.#audio.ontimeupdate = () => {
      if (!this.#audio.paused && this.#audio.duration > 0.0) {
        this.#notify(uuidAsString, { type: "playing" });
      }
    };
    this.#audio.onpause = () => this.#notify(uuidAsString, { type: "idle" });
    this.#audio.onstalled = () =>
      this.#notify(uuidAsString, { type: "buffering" });
    // Propagate any playback errors to subscribers
    this.#audio.onerror = (event, _source, _lineno, _colno, error) =>
      this.#notify(uuidAsString, {
        type: "error",
        reason: (error?.message ?? event instanceof Event) ? "Unknown" : event,
      });
  }

  /** Remove previously attached audio event listeners. */
  #unwatchAudio(): void {
    this.#audio.onended = null;
    this.#audio.onplay = null;
    this.#audio.onpause = null;
    this.#audio.onerror = null;
    this.#audio.onstalled = null;
    this.#audio.ontimeupdate = null;
  }
}
