/**
 * Simple logging stopwatch.
 *
 * A stopwatch instance records the time it was created and can log labelled
 * laps relative to that start. The implementation is intentionally lightweight
 * and uses `performance.now` internally.
 */
interface Stopwatch {
    /**
     * Logs the elapsed time since the stopwatch was created together with the
     * provided `label`.
     */
    lab(label: string): void
}

/**
 * Creates a {@link Stopwatch} that logs labelled laps to the console.
 *
 * Each invocation of {@link Stopwatch.lab} prints the time passed since the
 * stopwatch was created. This helper is useful when sprinkling lightweight
 * instrumentation around code sections during development.
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