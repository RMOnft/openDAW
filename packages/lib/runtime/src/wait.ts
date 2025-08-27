import {Exec, int, Observable, TimeSpan, tryCatch} from "@opendaw/lib-std"

/** Utilities for waiting on various asynchronous events. */
export namespace Wait {
    /**
     * Resolves on the next animation frame.
     *
     * @returns Promise that resolves after one frame.
     */
    export const frame = (): Promise<void> => new Promise(resolve => requestAnimationFrame(() => resolve()))

    /**
     * Resolves after the given number of animation frames.
     *
     * @param numFrames - Number of frames to wait.
     */
    export const frames = (numFrames: int): Promise<void> => new Promise(resolve => {
        let count = numFrames
        const callback = () => {if (--count <= 0) {resolve()} else {requestAnimationFrame(callback)}}
        requestAnimationFrame(callback)
    })

    /**
     * Waits for the specified {@link TimeSpan}.
     *
     * @param time - Duration to wait.
     * @param args - Optional arguments forwarded to the timeout callback.
     */
    export const timeSpan = <T>(time: TimeSpan, ...args: any[]): Promise<T> =>
        new Promise(resolve => setTimeout(resolve, time.millis(), ...args))

    /**
     * Resolves when an event is fired on the target.
     *
     * @param target - Event target to listen on.
     * @param type - Event type to await.
     */
    export const event = (target: EventTarget, type: string): Promise<void> =>
        new Promise<void>(resolve => target.addEventListener(type, resolve as Exec, {once: true}))

    /**
     * Resolves when the observable emits its next value.
     *
     * @param observable - Observable to subscribe to.
     */
    export const observable = (observable: Observable<unknown>) => new Promise<void>(resolve => {
        const terminable = observable.subscribe(() => {
            terminable.terminate()
            resolve()
        })
    })

    /**
     * Runs a generator until completion, yielding control every event loop turn.
     *
     * @param generator - Generator to exhaust.
     */
    export const complete = <R>(generator: Generator<unknown, R>): Promise<R> =>
        new Promise<R>((resolve, reject) => {
            const interval = setInterval(() => {
                const {status, value: next, error} = tryCatch(() => generator.next())
                if (status === "success") {
                    const {done, value} = next
                    if (done) {
                        clearInterval(interval)
                        resolve(value)
                    }
                } else {
                    clearInterval(interval)
                    reject(error)
                }
            }, 0)
        })
}