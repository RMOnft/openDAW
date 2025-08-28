import {int} from "@opendaw/lib-std"
import {PPQN, ppqn} from "./ppqn"

/** Tuple representing a musical fraction `n/d`. */
export type Fraction = Readonly<[int, int]>

/** Helpers for working with musical fractions. */
export namespace Fraction {
    /** Creates a builder for accumulating fractions. */
    export const builder = () => new Builder()
    /** Converts a fraction to a floating-point ratio. */
    export const toDouble = ([n, d]: Fraction): number => n / d
    /** Converts a time fraction to {@link ppqn} pulses. */
    export const toPPQN = ([n, d]: Fraction): ppqn => PPQN.fromSignature(n, d)

    /** Mutable accumulator for composing fraction sets. */
    class Builder {
        readonly #list: Array<Fraction> = []

        /** Adds a fraction to the collection. */
        add(fraction: Fraction): this {
            this.#list.push(fraction)
            return this
        }

        /** Returns fractions in insertion order. */
        asArray(): ReadonlyArray<Fraction> {return this.#list}
        /** Returns fractions sorted ascending by ratio. */
        asAscendingArray(): ReadonlyArray<Fraction> {return this.#list.toSorted((a, b) => toDouble(a) - toDouble(b))}
        /** Returns fractions sorted descending by ratio. */
        asDescendingArray(): ReadonlyArray<Fraction> {return this.#list.toSorted((a, b) => toDouble(b) - toDouble(a))}
    }
}
