import {AudioUnitBoxAdapter} from "@opendaw/studio-adapters"
import {EngineContext} from "./EngineContext"
import {asInstanceOf, int, Option, Terminable, Terminator} from "@opendaw/lib-std"
import {InstrumentDeviceProcessorFactory} from "./DeviceProcessorFactory"
import {AudioBusProcessor} from "./AudioBusProcessor"
import {AudioBuffer} from "./AudioBuffer"
import {AudioDeviceChain} from "./AudioDeviceChain"
import {MidiDeviceChain} from "./MidiDeviceChain"
import {AudioUnitOptions} from "./AudioUnitOptions"
import {AudioUnitInputAdapter} from "@opendaw/studio-adapters"
import {InstrumentDeviceProcessor} from "./InstrumentDeviceProcessor"

/**
 * High level container representing a track or device chain in the engine.
 *
 * Each instance corresponds to an
 * {@link @opendaw/studio-enums#AudioUnitType | AudioUnitType}.
 */
export class AudioUnit implements Terminable {
    static ID: int = 0 | 0

    readonly #id: int = AudioUnit.ID++

    readonly #terminator = new Terminator()

    readonly #context: EngineContext
    readonly #adapter: AudioUnitBoxAdapter

    readonly #midiDeviceChain: MidiDeviceChain
    readonly #audioDeviceChain: AudioDeviceChain

    #input: Option<InstrumentDeviceProcessor | AudioBusProcessor> = Option.None

    /**
     * @param context - engine context used to resolve processors
     * @param adapter - adapter exposing the backing box
     * @param options - configuration for the created device chains
     */
    constructor(context: EngineContext, adapter: AudioUnitBoxAdapter, options: AudioUnitOptions) {
        this.#context = context
        this.#adapter = adapter

        this.#midiDeviceChain = this.#terminator.own(new MidiDeviceChain(this))
        this.#audioDeviceChain = this.#terminator.own(new AudioDeviceChain(this, options))

        this.#terminator.ownAll(
            this.#adapter.input.catchupAndSubscribe(owner => {
                this.#midiDeviceChain.invalidateWiring()
                this.#audioDeviceChain.invalidateWiring()
                this.#input.ifSome(input => input.terminate())
                this.#input = owner.getValue().flatMap((input: AudioUnitInputAdapter) =>
                    Option.wrap(InstrumentDeviceProcessorFactory.create(context, input.box.box)))
            })
        )
    }

    /**
     * Returns the currently connected input processor if any.
     *
     * @returns Optional instrument or bus feeding this unit.
     */
    input(): Option<InstrumentDeviceProcessor | AudioBusProcessor> {return this.#input}
    /**
     * Convenience wrapper that asserts the input is an {@link AudioBusProcessor}.
     *
     * @throws Error if the input is missing or not an {@link AudioBusProcessor}.
     */
    inputAsAudioBus(): AudioBusProcessor {return asInstanceOf(this.#input.unwrap("No input available"), AudioBusProcessor)}
    /**
     * Access to the channel strip's audio output.
     *
     * @returns Buffer representing the processed output of the unit.
     */
    audioOutput(): AudioBuffer {return this.#audioDeviceChain.channelStrip.audioOutput}

    get midiDeviceChain(): MidiDeviceChain {return this.#midiDeviceChain}
    get audioDeviceChain(): AudioDeviceChain {return this.#audioDeviceChain}
    get context(): EngineContext {return this.#context}
    get adapter(): AudioUnitBoxAdapter {return this.#adapter}

    /**
     * Releases all resources and disconnects processors.
     */
    terminate(): void {
        console.debug(`terminate ${this}`)
        this.#terminator.terminate()
        this.#input.ifSome(input => input.terminate())
        this.#input = Option.None
    }

    toString(): string {return `{${this.constructor.name}(${this.#id})}`}
}
