import {ppqn} from "./ppqn"
import {assert, Bijective, BinarySearch, FloatArray, NumberComparator, quantizeFloor, unitValue} from "@opendaw/lib-std"

/** Bijective mapping between normalised time values. */
export interface GrooveFunction extends Bijective<unitValue, unitValue> {}

/** Time-warping function that repeats over a duration. */
export interface GroovePatternFunction extends GrooveFunction {
    /** Duration of a single pattern cycle in PPQN. */
    duration(): ppqn
}

/** Warp/unwarp positions expressed in PPQN. */
export interface Groove {
    /** Maps a position from original to warped space. */
    warp(position: ppqn): ppqn
    /** Maps a position from warped back to original space. */
    unwarp(position: ppqn): ppqn
}

export namespace Groove {
    /** No-op groove that leaves positions unchanged. */
    export const Identity: Groove = {
        warp: (position: ppqn): ppqn => position,
        unwarp: (position: ppqn): ppqn => position
    }
}

/** Applies a {@link GroovePatternFunction} to warp PPQN positions. */
export class GroovePattern implements Groove {
    readonly #func: GroovePatternFunction

    constructor(func: GroovePatternFunction) {this.#func = func}

    warp(position: ppqn): ppqn {return this.#transform(true, position)}
    unwarp(position: ppqn): ppqn {return this.#transform(false, position)}

    #transform(forward: boolean, position: ppqn): ppqn {
        const duration = this.#func.duration()
        const start = quantizeFloor(position, duration)
        const normalized = (position - start) / duration
        const transformed = forward ? this.#func.fx(normalized) : this.#func.fy(normalized)
        return start + transformed * duration
    }
}

/** Groove function defined by quantised lookup table. */
export class QuantisedGrooveFunction implements GrooveFunction {
    readonly #values: FloatArray

    constructor(values: FloatArray) {
        assert(values.length >= 2, "Must have at least two values [0, 1]")
        assert(values[0] === 0.0, "First entry must be zero")
        assert(values[values.length - 1] === 1.0, "Last entry must be one")
        this.#values = values
    }

    /** Forward transform from input to output space. */
    fx(x: unitValue): unitValue {
        if (x <= 0.0) {return 0.0}
        if (x >= 1.0) {return 1.0}
        const idxFloat = x * (this.#values.length - 1)
        const idxInteger = idxFloat | 0
        const valueFloor = this.#values[idxInteger]
        const alpha = idxFloat - idxInteger
        return valueFloor + alpha * (this.#values[idxInteger + 1] - valueFloor)
    }

    /** Inverse transform from output back to input space. */
    fy(y: unitValue): unitValue {
        if (y <= 0.0) {return 0.0}
        if (y >= 1.0) {return 1.0}
        const index = BinarySearch.rightMost(this.#values as unknown as ReadonlyArray<number>, y, NumberComparator)
        const curr = this.#values[index]
        const next = this.#values[index + 1]
        const alpha = (y - curr) / (next - curr)
        return (index + alpha) / (this.#values.length - 1)
    }
}

/** Combines multiple grooves and applies them sequentially. */
export class GrooveChain implements Groove {
    readonly #grooves: ReadonlyArray<Groove>

    constructor(grooves: ReadonlyArray<Groove>) {this.#grooves = grooves}

    warp(position: ppqn): ppqn {
        for (let i = 0; i < this.#grooves.length; i++) {position = this.#grooves[i].warp(position)}
        return position
    }

    unwarp(position: ppqn): ppqn {
        for (let i = this.#grooves.length - 1; i >= 0; i--) {position = this.#grooves[i].unwarp(position)}
        return position
    }
}