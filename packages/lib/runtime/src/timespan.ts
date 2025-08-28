import {Func, TimeSpan, unitValue} from "@opendaw/lib-std"

/**
 * Helpers for working with {@link TimeSpan} values.
 *
 * The utilities in this namespace provide convenience functions that operate on
 * openDAW's {@link TimeSpan} abstraction.
 */
export namespace TimeSpanUtils {
    /**
     * Creates a function that estimates the remaining time of a process given
     * the current progress.
     *
     * The returned function assumes that progress grows linearly with time. The
     * estimator can therefore be called repeatedly with the current progress to
     * obtain a rough projection of the remaining runtime.
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
            // Avoid division by zero when no progress has been reported yet.
            if (progress === 0.0) {return TimeSpan.POSITIVE_INFINITY}
            const runtime = performance.now() - startTime
            return TimeSpan.millis(runtime / progress - runtime)
        }
    }
}