import {
    assert,
    Exec,
    InaccessibleProperty,
    int,
    Option,
    Provider,
    safeExecute,
    Terminable,
    TerminableOwner,
    TimeSpan
} from "@opendaw/lib-std"

/** Resolves a promise with a value. */
export type Resolve<T> = (value: T) => void
/** Rejects a promise with a reason. */
export type Reject = (reason?: unknown) => void
/** Pair of resolve and reject callbacks. */
export type ExecutorTuple<T> = { resolve: Resolve<T>; reject: Reject }
/** Function signature used by {@link Promise} constructors. */
export type PromiseExecutor<T> = (resolve: Resolve<T>, reject: Reject) => void
/** Strategy describing how failed promises should be retried. */
export type RetryOption = { retry(reason: unknown, exec: Exec): boolean }

/**
 * Retry strategy that waits a fixed time span between attempts.
 */
export class IntervalRetryOption implements RetryOption {
    #count: int = 0 | 0
    constructor(readonly maxRetry: int, readonly timeSpan: TimeSpan) {}
    /** @inheritdoc */
    retry(reason: unknown, exec: Exec): boolean {
        if (++this.#count === this.maxRetry) {return false}
        console.debug(`${reason} > will retry in ${this.timeSpan.toString()}`)
        setTimeout(exec, this.timeSpan.millis())
        return true
    }
}

export namespace Promises {
    /** Successful result returned by {@link tryCatch}. */
    export class ResolveResult<T> {
        readonly status = "resolved"
        constructor(readonly value: T) {}
        error = InaccessibleProperty("Cannot access error when promise is resolved")
    }

    /** Failed result returned by {@link tryCatch}. */
    export class RejectedResult {
        readonly status = "rejected"
        constructor(readonly error: unknown) {}
        value = InaccessibleProperty("Cannot access value when promise is rejected")
    }

    /**
     * Wraps a promise so it can be aborted via a {@link TerminableOwner}.
     *
     * @param owner - Owner used to terminate the promise.
     * @param promise - Promise to wrap.
     * @returns The wrapped promise.
     */
    export const makeAbortable = async <T>(owner: TerminableOwner, promise: Promise<T>): Promise<T> => {
        let running = true
        owner.own(Terminable.create(() => running = false))
        return new Promise<T>((resolve, reject) =>
            promise.then(value => {if (running) {resolve(value)}}, reason => {if (running) {reject(reason)}}))
    }

    /**
     * Converts a promise into a discriminated union describing success or failure.
     *
     * @param promise - Promise to observe.
     * @returns A {@link ResolveResult} or {@link RejectedResult}.
     */
    export const tryCatch = <T>(promise: Promise<T>): Promise<ResolveResult<T> | RejectedResult> =>
        promise.then(value => new ResolveResult(value), error => new RejectedResult(error))

    /**
     * Retries the promise returned by `call` according to `retryOption`.
     *
     * @example
     * ```ts
     * const data = await Promises.retry(() => fetch(url).then(r => r.json()))
     * ```
     *
     * @param call - Function producing the promise.
     * @param retryOption - Strategy controlling retries.
     */
    export const retry = <T>(
        call: Provider<Promise<T>>,
        retryOption: RetryOption = new IntervalRetryOption(3, TimeSpan.seconds(3))): Promise<T> =>
        call().catch(reason => new Promise<T>((resolve, reject) => {
            const onFailure = (reason: unknown) => {
                if (!retryOption.retry(reason, () => call().then((value: T) => resolve(value), onFailure))) {
                    reject(reason)
                }
            }
            onFailure(reason)
        }))

    /** Utility for tests that fails once before succeeding. */
    export const fail = <T>(after: TimeSpan, thenUse: Provider<Promise<T>>): Provider<Promise<T>> => {
        let use: Provider<Promise<T>> = () =>
            new Promise<T>((_, reject) => setTimeout(() => reject("fails first"), after.millis()))
        return () => {
            const promise: Promise<T> = use()
            use = thenUse
            return promise
        }
    }

    /**
     * Rejects the promise if it does not settle within the given time span.
     *
     * @param promise - Promise to monitor.
     * @param timeSpan - Timeout duration.
     * @param fail - Optional message for the timeout error.
     */
    export const timeout = <T>(promise: Promise<T>, timeSpan: TimeSpan, fail?: string): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            let running: boolean = true
            const timeout = setTimeout(() => {
                running = false
                reject(new Error(fail ?? "timeout"))
            }, timeSpan.millis())
            promise
                .then((value) => {if (running) {resolve(value)}}, reason => {if (running) {reject(reason)}})
                .finally(() => clearTimeout(timeout))
        })
    }

    /**
     * Ensures that invocations of `fn` execute sequentially.
     *
     * @example
     * ```ts
     * const save = Promises.sequential(api.save)
     * await Promise.all([save("a"), save("b")])
     * ```
     */
    export const sequential = <T, R>(fn: (arg: T) => Promise<R>): (arg: T) => Promise<R> => {
        let lastPromise: Promise<any> = Promise.resolve(null)
        return (arg: T) => lastPromise = lastPromise.then(() => fn(arg))
    }

    /** Limits the number of concurrently running promises. */
    export class Limit<T> {
        readonly #waiting: Array<[Provider<Promise<T>>, PromiseWithResolvers<T>]>

        #running: int = 0 | 0

        /**
         * @param max - Maximum number of concurrent promises.
         */
        constructor(readonly max: int = 1) {
            this.#waiting = []
        }

        /**
         * Adds a provider to the queue.
         *
         * @param provider - Function producing the promise.
         * @returns A promise resolving to the provider's result.
         */
        async add(provider: Provider<Promise<T>>): Promise<T> {
            if (this.#running < this.max) {
                this.#running++
                return provider().finally(() => this.#continue())
            } else {
                const resolvers: PromiseWithResolvers<T> = Promise.withResolvers<T>()
                this.#waiting.push([provider, resolvers])
                return resolvers.promise.finally(() => this.#continue())
            }
        }

        #continue(): void {
            assert(this.#running > 0, "Internal Error in Promises.Limit")
            if (--this.#running < this.max) {
                if (this.#waiting.length > 0) {
                    const [provider, {resolve, reject}] = this.#waiting.shift()!
                    this.#running++
                    provider().then(resolve, reject)
                }
            }
        }
    }

    /** Tracks the latest promise and ignores outdated results. */
    export class Latest<T> implements Terminable {
        readonly #onResolve: Resolve<T>
        readonly #onReject: Reject
        readonly #onFinally?: Exec

        #latest: Option<Promise<T>> = Option.None

        /**
         * @param onResolve - Called when the latest promise resolves.
         * @param onReject - Called when the latest promise rejects.
         * @param onFinally - Optional callback when the promise settles.
         */
        constructor(onResolve: Resolve<T>, onReject: Reject, onFinally?: Exec) {
            this.#onResolve = onResolve
            this.#onReject = onReject
            this.#onFinally = onFinally
        }

        /**
         * Updates the tracked promise.
         *
         * @param promise - Promise to track.
         */
        update(promise: Promise<T>): void {
            this.#latest = Option.wrap(promise)
            promise
                .then(value => {if (this.#latest.contains(promise)) {this.#onResolve(value)}})
                .catch(reason => {if (this.#latest.contains(promise)) {this.#onReject(reason)}})
                .finally(() => {
                    if (this.#latest.contains(promise)) {
                        this.terminate()
                        safeExecute(this.#onFinally)
                    }
                })
        }

        /** Terminates tracking and ignores pending results. */
        terminate(): void {this.#latest = Option.None}
    }
}

