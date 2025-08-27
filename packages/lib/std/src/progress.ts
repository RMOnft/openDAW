import {int, Procedure, unitValue} from "./lang"
import {Arrays} from "./arrays"

/** Utilities for reporting proportional progress of parallel tasks. */
export namespace Progress {
    /** Callback receiving progress in the range `[0,1]`. */
    export type Handler = Procedure<unitValue>

    /** No‑op handler used as default. */
    export const Empty: Handler = Object.freeze(_ => {})

    /**
     * Splits a progress handler into `count` sub handlers that each report
     * a fraction of the total progress.
     * @param progress Aggregate handler to receive combined progress.
     * @param count Number of parallel subtasks.
     */
    export const split = (progress: Handler, count: int): ReadonlyArray<Handler> => {
        const collect = new Float32Array(count)
        return Arrays.create(index => (value: number) => {
            collect[index] = value
            progress(collect.reduce((total, value) => total + value, 0.0) / count)
        }, count)
    }
}