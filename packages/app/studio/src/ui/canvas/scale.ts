import {unitValue} from "@opendaw/lib-std"

/**
 * Maps between domain specific "unit" values and normalized `[0,1]` values.
 *
 * A {@link Scale} is used whenever drawing on a canvas requires translating
 * arbitrary units—such as seconds or decibels—to a normalized coordinate
 * system. Implementations must provide the forward and inverse conversion.
 */
export interface Scale {
    /**
     * Converts a unit value to its normalized representation.
     *
     * @param unit - Value in domain specific units.
     * @returns The corresponding normalized value in the range `[0,1]`.
     */
    unitToNorm(unit: number): unitValue

    /**
     * Converts a normalized value back into domain units.
     *
     * @param norm - Normalized value in the range `[0,1]`.
     * @returns The value expressed in domain units.
     */
    normToUnit(norm: unitValue): number
}

/** Linear mapping between unit and normalized coordinates. */
export class LinearScale implements Scale {
    readonly #min: number
    readonly #max: number
    readonly #range: number
    readonly #rangeInv: number

    /**
     * @param min - Minimum unit value represented by `0`.
     * @param max - Maximum unit value represented by `1`.
     */
    constructor(min: number, max: number) {
        this.#min = min
        this.#max = max
        this.#range = max - min
        this.#rangeInv = 1.0 / this.#range
    }

    /** Minimum unit value covered by this scale. */
    get min(): number {return this.#min}

    /** Maximum unit value covered by this scale. */
    get max(): number {return this.#max}

    /**
     * Converts a normalized value to the corresponding unit value.
     *
     * @param norm - Normalized value in the range `[0,1]`.
     */
    normToUnit(norm: number): number {return this.#min + norm * this.#range}

    /**
     * Converts a unit value into its normalized representation.
     *
     * @param unit - Value in domain specific units.
     */
    unitToNorm(unit: number): number {return (unit - this.#min) * this.#rangeInv}
}

/** Logarithmic mapping between unit and normalized coordinates. */
export class LogScale implements Scale {
    readonly #min: number
    readonly #max: number
    readonly #range: number
    readonly #logMin: number
    readonly #logRangeInv: number

    /**
     * @param min - Minimum unit value (>0) represented by `0`.
     * @param max - Maximum unit value represented by `1`.
     */
    constructor(min: number, max: number) {
        this.#min = min
        this.#max = max
        this.#range = Math.log(max / min)
        this.#logMin = Math.log(min)
        this.#logRangeInv = 1.0 / (Math.log(max) - this.#logMin)
    }

    /** Minimum unit value covered by this scale. */
    get min(): number {return this.#min}

    /** Maximum unit value covered by this scale. */
    get max(): number {return this.#max}

    /**
     * Converts a normalized value to a unit value using a logarithmic curve.
     *
     * @param norm - Normalized value in the range `[0,1]`.
     */
    normToUnit(norm: unitValue): number {return this.#min * Math.exp(norm * this.#range)}

    /**
     * Converts a unit value to its normalized representation on a logarithmic
     * scale.
     *
     * @param unit - Value in domain specific units (>0).
     */
    unitToNorm(unit: number): unitValue {return (Math.log(unit) - this.#logMin) * this.#logRangeInv}
}