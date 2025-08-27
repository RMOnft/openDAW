import {FloatArray, int, panic, unitValue} from "./lang"

/**
 * Interface for deterministic pseudo random number generators.
 * Implementations should produce repeatable sequences when seeded
 * with the same value.
 */
export interface Random {
    /** Seed the generator with the given value. */
    setSeed(value: int): void
    /** Returns a random floating point number in `[min,max)`. */
    nextDouble(min: number, max: number): number
    /** Returns a random integer in `[min,max)`. */
    nextInt(min: int, max: int): int
    /** Picks a random element from the provided array-like. */
    nextElement<T>(array: ArrayLike<T>): T
    /** Returns a random boolean value. */
    nextBoolean(): boolean
    /** Returns a random unit interval value in `[0,1)`. */
    uniform(): unitValue
}

export namespace Random {
    /**
     * Creates a {@link Random} instance seeded with the given value.
     * @param seed Initial seed for the generator.
     */
    export const create = (seed: int = 0xF123F42): Random => new Mulberry32(seed)

    /**
     * Generates a monotone ascending sequence of random unitValue numbers.
     * @param target The target array to fill with random values.
     * @param noise Tell the method how noisy the sequence should be. 0 leads to a linear sequence.
     * @param random The random number generator to use.
     * @returns The target array.
     */
    export const monotoneAscending = (target: FloatArray, noise: int = 128, random: Random = create()): FloatArray => {
        const length = target.length
        if (length < 2) {return panic("Array must have at least 2 elements")}
        let sum = 0.0
        for (let i = 1; i < length; i++) {
            const value = Math.floor(random.uniform() * (1.0 + noise)) + 1.0
            target[i] = value
            sum += value
        }
        let acc = 0.0
        target[0] = 0.0
        for (let i = 1; i < length; i++) {
            acc += target[i]
            target[i] = acc / sum
        }
        return target
    }
}

/**
 * Mulberry32 PRNG by Tommy Ettinger.
 * Small and fast generator with 32‑bit state suitable for non‑cryptographic
 * use cases such as tests or procedural content.
 */
export class Mulberry32 implements Random {
    #seed: int = 0

    constructor(seed: int) {this.setSeed(seed)}

    /** @inheritdoc */
    setSeed(value: int): void {this.#seed = value & 0xFFFFFFFF}
    /** @inheritdoc */
    nextDouble(min: number, max: number): number {return min + this.uniform() * (max - min)}
    /** @inheritdoc */
    nextInt(min: int, max: int): int {return min + Math.floor(this.uniform() * (max - min))}
    /** @inheritdoc */
    nextElement<T>(array: ArrayLike<T>): T {return array[Math.floor(this.uniform() * array.length)]}
    /** @inheritdoc */
    nextBoolean(): boolean {return this.uniform() < 0.5}
    /** @inheritdoc */
    uniform(): unitValue {
        let t = this.#seed += 0x6D2B79F5
        t = Math.imul(t ^ t >>> 15, t | 1)
        t ^= t + Math.imul(t ^ t >>> 7, t | 61)
        return ((t ^ t >>> 14) >>> 0) / 4294967296.0
    }
}