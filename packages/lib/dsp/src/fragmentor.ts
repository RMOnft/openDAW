import {int} from "@opendaw/lib-std"
import {ppqn} from "./ppqn"

/** Helpers to iterate over PPQN ranges. */
export class Fragmentor {
    /** Iterates positions between two PPQN values using a fixed step size. */
    static* iterate(p0: ppqn, p1: ppqn, stepSize: ppqn): Generator<ppqn> {
        let index = Math.ceil(p0 / stepSize)
        let position = index * stepSize
        while (position < p1) {
            yield position
            position = ++index * stepSize
        }
    }

    /**
     * Iterates positions and their corresponding index within the range.
     *
     * @returns An iterator yielding objects with position and step index.
     */
    static* iterateWithIndex(p0: ppqn, p1: ppqn, stepSize: ppqn): Generator<{ position: ppqn, index: int }> {
        let index = Math.ceil(p0 / stepSize)
        let position = index * stepSize
        while (position < p1) {
            yield {position, index}
            position = ++index * stepSize
        }
    }
}