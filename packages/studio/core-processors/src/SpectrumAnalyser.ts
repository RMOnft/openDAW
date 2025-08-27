import {FFT, Window} from "@opendaw/lib-dsp"
import {int} from "@opendaw/lib-std"

/**
 * Simple FFT based spectrum analyser used for visualisation.
 */
export class SpectrumAnalyser {
    /** Default FFT size used when no size is supplied. */
    static readonly DEFAULT_SIZE = 1024

    readonly #fftSize: number
    readonly #numBins: number
    readonly #fft: FFT
    readonly #real: Float32Array
    readonly #imag: Float32Array
    readonly #window: Float32Array
    readonly #bins: Float32Array

    #index: number = 0

    /**
     * When set to `true` the previous spectrum values decay over time instead of
     * being replaced immediately.
     */
    decay: boolean = false

    /**
     * @param n - FFT size determining frequency resolution
     */
    constructor(n: int = SpectrumAnalyser.DEFAULT_SIZE) {
        this.#fftSize = n
        this.#fft = new FFT(this.#fftSize)
        this.#real = new Float32Array(this.#fftSize)
        this.#imag = new Float32Array(this.#fftSize)
        this.#window = Window.create(Window.Type.Blackman, this.#fftSize)
        this.#numBins = this.#fftSize >> 1
        this.#bins = new Float32Array(this.#numBins)
    }

    /** Clears accumulated spectrum data. */
    clear(): void {
        this.#bins.fill(0.0)
        this.#index = 0
    }

    /** Returns the number of frequency bins. */
    numBins(): int {return this.#numBins}
    /** Buffer containing the current spectrum magnitude per bin. */
    bins(): Float32Array {return this.#bins}

    /**
     * Accumulates samples and updates the spectrum once {@link #fftSize} samples
     * have been collected.
     *
     * @param left - Left channel samples.
     * @param right - Right channel samples.
     * @param fromIndex - Start index within the channel buffers.
     * @param toIndex - End index (exclusive) within the channel buffers.
     */
    process(left: Float32Array, right: Float32Array, fromIndex: int, toIndex: int): void {
        for (let i = fromIndex; i < toIndex; ++i) {
            this.#real[this.#index] = this.#window[this.#index] * (left[i] + right[i])
            if (++this.#index === this.#fftSize) {
                this.#update()
            }
        }
    }

    /** Performs the FFT and updates the magnitude bins. */
    #update(): void {
        this.#fft.process(this.#real, this.#imag)
        const scale = 1.0 / this.#numBins
        for (let i = 0; i < this.#numBins; ++i) {
            const re = this.#real[i]
            const im = this.#imag[i]
            const energy = Math.sqrt(re * re + im * im) * scale
            if (this.#bins[i] < energy) {
                this.#bins[i] = energy
            } else if (this.decay) {
                this.#bins[i] *= 0.90 // TODO Can we compute a coefficient? (depends on the FPS!)
            }
        }
        this.#index = 0
        this.#imag.fill(0.0)
        this.decay = false
    }
}
