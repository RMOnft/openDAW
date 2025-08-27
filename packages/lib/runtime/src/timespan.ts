import {Func, TimeSpan, unitValue} from "@opendaw/lib-std"

/** Helpers for working with {@link TimeSpan}. */
export namespace TimeSpanUtils {
    /**
     * Creates a function that estimates the remaining time of a process given
     * the current progress.
     *
     * @example
     * ```ts
     * const estimate = TimeSpanUtils.startEstimator()
     * // ...later
     * console.log(estimate(0.5).toString())
     * ```
     *
     * @returns Function accepting the current progress and returning the estimated {@link TimeSpan} left.
     */
    export const startEstimator = (): Func<number, TimeSpan> => {
        const startTime: number = performance.now()
        return (progress: unitValue): TimeSpan => {
            if (progress === 0.0) {return TimeSpan.POSITIVE_INFINITY}
            const runtime = (performance.now() - startTime)
            return TimeSpan.millis(runtime / progress - runtime)
        }
    }
}