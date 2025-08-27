/** Simple logging stopwatch. */
interface Stopwatch {lab(label: string): void}

/**
 * Creates a {@link Stopwatch} that logs labelled laps to the console.
 *
 * @example
 * ```ts
 * const sw = stopwatch()
 * // ...do work
 * sw.lab("step 1")
 * ```
 *
 * @param level - Console level used for logging, defaults to `"debug"`.
 * @returns A stopwatch instance.
 */
export const stopwatch = (level: "debug" | "info" = "debug"): Stopwatch => {
    const startTime = performance.now()
    return {
        lab: (label: string) =>
            console[level].call(console, `${label} in ${(performance.now() - startTime).toFixed(1)}ms`)
    }
}