import { Promises } from "./promises"

/**
 * Network related helper functions.
 */
export namespace network {
    const limit = new Promises.Limit<Response>(4)

    /**
     * Fetches a resource but limits the amount of concurrent requests.
     *
     * @example
     * ```ts
     * const response = await network.limitFetch("/api/data")
     * const json = await response.json()
     * ```
     *
     * @param input - Request information passed to {@link fetch}.
     * @param init - Optional fetch options.
     * @returns A promise resolving to the {@link Response}.
     */
    export const limitFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
        limit.add(() => fetch(input, init))
}