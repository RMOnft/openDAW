import {int} from "@opendaw/lib-std"
import {PPQN, ppqn} from "./ppqn"

/** Tuple representing a musical fraction `n/d`. */
export type Fraction = Readonly<[int, int]>

export namespace Fraction {
    /** Creates a builder for accumulating fractions. */
    export const builder = () => new Builder()
    /** Converts a fraction to a floating-point ratio. */
    export const toDouble = ([n, d]: Fraction): number => n / d
    /** Converts a time fraction to {@link ppqn} pulses. */
    export const toPPQN = ([n, d]: Fraction): ppqn => PPQN.fromSignature(n, d)

    class Builder {
        readonly #list: Array<Fraction> = []

        add(fraction: Fraction): this {
            this.#list.push(fraction)
            return this
        }

        asArray(): ReadonlyArray<Fraction> {return this.#list}
        asAscendingArray(): ReadonlyArray<Fraction> {return this.#list.toSorted((a, b) => toDouble(a) - toDouble(b))}
        asDescendingArray(): ReadonlyArray<Fraction> {return this.#list.toSorted((a, b) => toDouble(b) - toDouble(a))}
    }
}