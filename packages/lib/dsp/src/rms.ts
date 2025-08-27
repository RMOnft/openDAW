import {int} from "@opendaw/lib-std"

/**
 * Rolling root-mean-square (RMS) calculator for continuous streams of
 * samples. Internally a circular buffer is used to maintain the last `n`
 * squared values and compute the RMS in constant time.
 */
export class RMS {
    readonly #values: Float32Array
    readonly #inv: number

    #index: int
    #sum: number

    /**
     * @param n - Length of the sliding window in samples.
     */
    constructor(n: int) {
        this.#values = new Float32Array(n)
        this.#inv = 1.0 / n

        this.#index = 0 | 0
        this.#sum = 0.0
    }

    /**
     * Inserts a new sample into the window and returns the updated RMS value.
     *
     * @param x - Input sample to add.
     * @returns Current RMS of the window contents.
     */
    pushPop(x: number): number {
        const squared = x * x
        this.#sum -= this.#values[this.#index]
        this.#sum += squared
        this.#values[this.#index] = squared
        if (++this.#index === this.#values.length) {this.#index = 0}
        return this.#sum <= 0.0 ? 0.0 : Math.sqrt(this.#sum * this.#inv)
    }

    /** Resets the window contents and internal state. */
    clear(): void {
        this.#values.fill(0.0)
        this.#sum = 0.0
        this.#index = 0 | 0
    }
}