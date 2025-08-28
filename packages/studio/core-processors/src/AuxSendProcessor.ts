import {EngineContext} from "./EngineContext"
import {AudioInput, Block, Processor} from "./processing"
import {Option, Terminable} from "@opendaw/lib-std"
import {AuxSendBoxAdapter} from "@opendaw/studio-adapters"
import {AudioBuffer} from "./AudioBuffer"
import {AutomatableParameter} from "./AutomatableParameter"
import {dbToGain, Ramp} from "@opendaw/lib-dsp"
import {AudioProcessor} from "./AudioProcessor"

/**
 * Taps a source {@link AudioBuffer} and routes it to an auxiliary send.
 */
export class AuxSendProcessor extends AudioProcessor implements Processor, AudioInput {
    readonly #adapter: AuxSendBoxAdapter

    readonly #audioOutput: AudioBuffer
    readonly #rampGainL: Ramp<number>
    readonly #rampGainR: Ramp<number>

    readonly #parameterSendGain: AutomatableParameter<number>
    readonly #parameterSendPan: AutomatableParameter<number>

    #source: Option<AudioBuffer> = Option.None
    #needsUpdate: boolean = true
    #processing: boolean = false

    /**
     * @param context - shared engine context
     * @param adapter - adapter providing parameter access to the send box
     */
    constructor(context: EngineContext, adapter: AuxSendBoxAdapter) {
        super(context)

        this.#adapter = adapter

        this.#audioOutput = new AudioBuffer()
        this.#rampGainL = Ramp.linear(sampleRate)
        this.#rampGainR = Ramp.linear(sampleRate)
        this.#parameterSendGain = this.own(this.bindParameter(adapter.sendGain))
        this.#parameterSendPan = this.own(this.bindParameter(adapter.sendPan))

        this.own(context.registerProcessor(this))
        this.readAllParameters()
    }

    /** Clears the output buffer. */
    reset(): void {this.#audioOutput.clear()}

    /**
     * Exposes the backing adapter controlling this send.
     *
     * @returns adapter providing access to the underlying box parameters
     */
    get adapter(): AuxSendBoxAdapter {return this.#adapter}

    /**
     * Sets the audio source to be routed through the send.
     */
    setAudioSource(source: AudioBuffer): Terminable {
        this.#source = Option.wrap(source)
        return {terminate: () => this.#source = Option.None}
    }

    /** Buffer that receives the processed send output. */
    get audioOutput(): AudioBuffer {return this.#audioOutput}

    /**
     * Applies gain and panning to the source and writes into the output buffer.
     */
    processAudio(_block: Block, fromIndex: number, toIndex: number): void {
        if (this.#source.isEmpty()) {return}
        if (this.#needsUpdate) {
            const gain = dbToGain(this.#parameterSendGain.getValue())
            const panning = this.#parameterSendPan.getValue()
            this.#rampGainL.set((1.0 - Math.max(0.0, panning)) * gain, this.#processing)
            this.#rampGainR.set((1.0 + Math.min(0.0, panning)) * gain, this.#processing)
            this.#needsUpdate = false
        }
        const outL = this.#audioOutput.getChannel(0)
        const outR = this.#audioOutput.getChannel(1)
        const source = this.#source.unwrap()
        const srcL = source.getChannel(0)
        const srcR = source.getChannel(1)
        if (this.#rampGainL.isInterpolating() || this.#rampGainR.isInterpolating()) {
            for (let i = fromIndex; i < toIndex; i++) {
                outL[i] = srcL[i] * this.#rampGainL.moveAndGet()
                outR[i] = srcR[i] * this.#rampGainR.moveAndGet()
            }
        } else {
            const gainL = this.#rampGainL.get()
            const gainR = this.#rampGainR.get()
            for (let i = fromIndex; i < toIndex; i++) {
                outL[i] = srcL[i] * gainL
                outR[i] = srcR[i] * gainR
            }
        }
        this.#processing = true
    }

    /** Marks internal state dirty when a parameter changes. */
    parameterChanged(_parameter: AutomatableParameter): void {
        this.#needsUpdate = true
    }
}