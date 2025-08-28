import {AudioInput, Block, Processor} from "./processing"
import {int, Option, Terminable} from "@opendaw/lib-std"
import {EngineContext} from "./EngineContext"
import {dbToGain, Event, Ramp, StereoMatrix} from "@opendaw/lib-dsp"
import {AudioBuffer} from "./AudioBuffer"
import {AudioUnitBoxAdapter} from "@opendaw/studio-adapters"
import {PeakBroadcaster} from "./PeakBroadcaster"
import {AudioProcessor} from "./AudioProcessor"
import {AutomatableParameter} from "./AutomatableParameter"
import {RenderQuantum} from "./constants"

/**
 * Implements a mixer channel strip applying volume, panning and mute/solo
 * logic to an incoming audio stream.
 */
export class ChannelStripProcessor extends AudioProcessor implements Processor, AudioInput, Terminable {
    readonly #adapter: AudioUnitBoxAdapter

    readonly #audioOutput: AudioBuffer
    readonly #rawBuffer: StereoMatrix.Channels
    readonly #peaks: PeakBroadcaster

    readonly #parameterVolume: AutomatableParameter<number>
    readonly #parameterPanning: AutomatableParameter<number>
    readonly #parameterMute: AutomatableParameter<boolean>
    readonly #parameterSolo: AutomatableParameter<boolean>

    readonly #gainL: Ramp<number> = Ramp.linear(sampleRate)
    readonly #gainR: Ramp<number> = Ramp.linear(sampleRate)
    readonly #outGain: Ramp<number> = Ramp.linear(sampleRate)

    #source: Option<AudioBuffer> = Option.None

    #updateGain: boolean = true
    #processing: boolean = false

    /**
     * @param context - global engine context
     * @param adapter - adapter exposing channel strip parameters
     */
    constructor(context: EngineContext, adapter: AudioUnitBoxAdapter) {
        super(context)

        this.#adapter = adapter

        this.#audioOutput = new AudioBuffer()
        this.#rawBuffer = [new Float32Array(RenderQuantum), new Float32Array(RenderQuantum)]
        this.#peaks = this.own(new PeakBroadcaster(context.broadcaster, this.#adapter.address))

        this.#parameterVolume = this.own(this.bindParameter(this.#adapter.namedParameter.volume))
        this.#parameterPanning = this.own(this.bindParameter(this.#adapter.namedParameter.panning))
        this.#parameterMute = this.own(this.bindParameter(this.#adapter.namedParameter.mute))
        this.#parameterSolo = this.own(this.bindParameter(this.#adapter.namedParameter.solo))

        this.ownAll(
            context.registerProcessor(this),
            context.mixer.attachChannelStrip(this)
        )
        this.readAllParameters()
    }

    /** Resets peaks and output buffers. */
    reset(): void {
        this.#peaks.clear()
        this.#audioOutput.clear()
        this.#rawBuffer[0].fill(0.0)
        this.#rawBuffer[1].fill(0.0)
        this.#processing = false
    }

    /** Current mute state. */
    get isMute(): boolean {return this.#parameterMute.getValue()}
    /** Current solo state. */
    get isSolo(): boolean {return this.#parameterSolo.getValue()}
    /** Exposes the adapter to external clients. */
    get adapter(): AudioUnitBoxAdapter {return this.#adapter}
    /** Buffer receiving the processed signal. */
    get audioOutput(): AudioBuffer {return this.#audioOutput}

    /**
     * Handles events dispatched to this processor.
     *
     * Currently channel strips do not react to events, so the method is a no-op.
     */
    handleEvent(_event: Event): void {}

    /**
     * Applies gain/pan/mute logic and records peak information.
     */
    processAudio(_block: Block, fromIndex: int, toIndex: int): void {
        if (this.#source.isEmpty()) {return}
        if (this.#updateGain) {
            const mixer = this.context.mixer
            mixer.updateSolo()
            const isSolo = this.isSolo || mixer.isVirtualSolo(this)
            const silent = this.isMute || (mixer.hasChannelSolo() && !isSolo && !this.#adapter.isOutput)
            const gain = dbToGain(this.#parameterVolume.getValue())
            const panning = this.#parameterPanning.getValue()
            this.#gainL.set((1.0 - Math.max(0.0, panning)) * gain, this.#processing)
            this.#gainR.set((1.0 + Math.min(0.0, panning)) * gain, this.#processing)
            this.#outGain.set(silent ? 0.0 : 1.0, this.#processing)
            this.#updateGain = false
        }
        const source = this.#source.unwrap()
        const [srcL, srcR] = source.channels()
        const [outL, outR] = this.#audioOutput.channels()
        const [rawL, rawR] = this.#rawBuffer
        if (this.#gainL.isInterpolating() || this.#gainR.isInterpolating() || this.#outGain.isInterpolating()) {
            for (let i = fromIndex; i < toIndex; i++) {
                const gain = this.#outGain.moveAndGet()
                const l = srcL[i] * this.#gainL.moveAndGet()
                const r = srcR[i] * this.#gainR.moveAndGet()
                outL[i] = l * gain
                outR[i] = r * gain
                rawL[i] = l
                rawR[i] = r
            }
        } else {
            const gainL = this.#gainL.get()
            const gainR = this.#gainR.get()
            const outGain = this.#outGain.get()
            for (let i = fromIndex; i < toIndex; i++) {
                const l = srcL[i] * gainL
                const r = srcR[i] * gainR
                rawL[i] = l
                rawR[i] = r
                outL[i] = l * outGain
                outR[i] = r * outGain
            }
        }
        this.#peaks.process(rawL, rawR, fromIndex, toIndex)
        this.#processing = true
    }

    /** Asserts that the output buffer does not contain invalid numbers. */
    finishProcess(): void {this.#audioOutput.assertSanity()}

    /** Reacts to parameter automation changes. */
    parameterChanged(parameter: AutomatableParameter): void {
        if (parameter === this.#parameterVolume) {
            this.requestGainUpdate()
        } else if (parameter === this.#parameterPanning) {
            this.requestGainUpdate()
        } else if (parameter === this.#parameterMute) {
            this.requestGainUpdate()
        } else if (parameter === this.#parameterSolo) {
            this.context.mixer.onChannelStripSoloChanged(this)
        }
    }

    /** Flags gain/panning values as dirty. */
    requestGainUpdate(): void {this.#updateGain = true}

    // TODO Optimise me some day. Updating the solo like might be a bit cumbersome?
    /**
     * Requests the solo state be reconsidered by the mixer.
     */
    requestSoloUpdate(): void {this.#updateGain = true}

    /**
     * Sets the upstream audio buffer feeding this channel strip.
     */
    setAudioSource(source: AudioBuffer): Terminable {
        this.#source = Option.wrap(source)
        return {terminate: () => this.#source = Option.None}
    }

    toString(): string {return `{${this.constructor.name}}`}
}