import { Promises } from "./promises";

/**
 * Network related helper functions.
 *
 * Used by services such as the Studio's [SampleApi](../../../app/studio/src/service/SampleApi.ts)
 * to throttle HTTP requests.
 *
 * Security note: These utilities perform no validation or authentication.
 * Callers should only request trusted URLs and must verify responses before
 * using them.
 */
export namespace network {
  /**
   * Limits the number of concurrent fetch requests.
   *
   * Raising the limit may increase load on both client and server.
   */
  const limit = new Promises.Limit<Response>(4);

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
   *
   * Error Handling: rejections from the underlying {@link fetch} call are
   * propagated to the caller without modification.
   */
  export const limitFetch = (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => limit.add(() => fetch(input, init));
}
