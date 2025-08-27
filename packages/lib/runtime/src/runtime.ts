import { Exec, Subscription } from "@opendaw/lib-std"

/**
 * Utilities for working with timers and the JavaScript runtime.
 */
export namespace Runtime {
    /**
        * Creates a debounced function that delays invoking {@link Exec} until after
        * `timeout` milliseconds have elapsed since the last time the debounced
        * function was called.
        *
        * @param exec - Function to debounce.
        * @param timeout - Delay in milliseconds, defaults to `1000`.
        *
        * @example
        * ```ts
        * const log = Runtime.debounce(console.log, 500)
        * window.addEventListener("resize", () => log("resized"))
        * ```
        */
    export const debounce = (() => {
        let id: any = undefined
        return (exec: Exec, timeout: number = 1000) => {
            clearTimeout(id)
            id = setTimeout(exec, timeout)
        }
    })()

    /**
     * Executes a function repeatedly at the specified interval.
     *
     * @param exec - Function to invoke.
     * @param time - Interval in milliseconds.
     * @param args - Optional arguments passed to the function.
     * @returns A {@link Subscription} used to cancel the interval.
     */
    export const scheduleInterval = (exec: Exec, time: number, ...args: Array<any>): Subscription => {
        const id = setInterval(exec, time, ...args)
        return {terminate: () => clearInterval(id)}
    }

    /**
     * Executes a function once after a delay.
     *
     * @param exec - Function to invoke.
     * @param time - Delay in milliseconds.
     * @param args - Optional arguments passed to the function.
     * @returns A {@link Subscription} used to cancel the timeout.
     */
    export const scheduleTimeout = (exec: Exec, time: number, ...args: Array<any>): Subscription => {
        const id = setTimeout(exec, time, ...args)
        return {terminate: () => clearTimeout(id)}
    }
}