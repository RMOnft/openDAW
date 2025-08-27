import {Arrays, int, Terminable} from "@opendaw/lib-std"
import {Address} from "@opendaw/lib-box"
import {RMS, StereoMatrix} from "@opendaw/lib-dsp"
import {LiveStreamBroadcaster} from "@opendaw/lib-fusion"
import {RenderQuantum} from "./constants"

/**
 * Computes peak and RMS levels for a stereo signal and broadcasts them via a
 * {@link LiveStreamBroadcaster}.
 */
export class PeakBroadcaster implements Terminable {
    /** Exponential decay applied to stored peak values between samples. */
    static readonly PEAK_DECAY = Math.exp(-1.0 / (sampleRate * 0.250))
    /** Length of the sliding RMS window in samples. */
    static readonly RMS_WINDOW = Math.floor(sampleRate * 0.100)

    readonly #broadcaster: LiveStreamBroadcaster
    readonly #address: Address

    readonly #values: Float32Array
    readonly #rms: ReadonlyArray<RMS>
    readonly #terminable: Terminable

    #peakL: number = 0.0
    #peakR: number = 0.0
    #rmsL: number = 0.0
    #rmsR: number = 0.0

    /**
     * @param broadcaster - stream used to send metering updates
     * @param address - address identifying the stream
     */
    constructor(broadcaster: LiveStreamBroadcaster, address: Address) {
        this.#broadcaster = broadcaster
        this.#address = address

        this.#values = new Float32Array(4)
        this.#rms = Arrays.create(() => new RMS(PeakBroadcaster.RMS_WINDOW), 2)
        this.#terminable = this.#broadcaster.broadcastFloats(this.#address, this.#values, () => {
            this.#values[0] = this.#peakL
            this.#values[1] = this.#peakR
            this.#values[2] = this.#rmsL
            this.#values[3] = this.#rmsR
        })
    }

    /** Resets stored peak and RMS values. */
    clear(): void {
        this.#rms[0].clear()
        this.#rms[1].clear()
        this.#peakL = 0.0
        this.#peakR = 0.0
    }

    /**
     * Updates peak and RMS statistics for the given sample range.
     *
     * @param outL - Left channel samples.
     * @param outR - Right channel samples.
     * @param fromIndex - Start index within the provided buffers.
     * @param toIndex - End index (exclusive) within the provided buffers.
     */
    process(outL: Float32Array, outR: Float32Array, fromIndex: int = 0, toIndex: int = RenderQuantum): void {
        const [rmsL, rmsR] = this.#rms
        for (let i = fromIndex; i < toIndex; i++) {
            const l = outL[i]
            const r = outR[i]
            if (this.#peakL < l) {this.#peakL = l} else {this.#peakL *= PeakBroadcaster.PEAK_DECAY}
            if (this.#peakR < r) {this.#peakR = r} else {this.#peakR *= PeakBroadcaster.PEAK_DECAY}
            this.#rmsL = rmsL.pushPop(l)
            this.#rmsR = rmsR.pushPop(r)
        }
    }

    /** Convenience wrapper accepting a stereo channel tuple. */
    processStereo([l, r]: StereoMatrix.Channels, fromIndex: int = 0, toIndex: int = RenderQuantum): void {
        this.process(l, r, fromIndex, toIndex)
    }

    terminate(): void {this.#terminable.terminate()}
}