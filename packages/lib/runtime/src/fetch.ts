import {
  asDefined,
  byte,
  ByteArrayOutput,
  Func,
  Procedure,
  unitValue,
} from "@opendaw/lib-std";

/** Utilities for working with the Fetch API. */
export namespace Fetch {
  /**
   * Creates a function that reads a {@link Response} into an `ArrayBuffer`
   * while reporting download progress.
   *
   * @example
   * ```ts
   * const load = Fetch.ProgressArrayBuffer(p => console.log(p * 100))
   * const buffer = await load(await fetch(url))
   * ```
   *
   * @param progress - Callback receiving the progress as a value between `0` and `1`.
   * @returns Function that consumes a {@link Response} and resolves with the body as `ArrayBuffer`.
   *
   * Error Handling: stream read errors are not caught and will reject the
   * returned promise; callers should handle failures accordingly.
   */
  export const ProgressArrayBuffer =
    (
      progress: Procedure<unitValue>,
    ): Func<Response, Promise<ArrayBufferLike>> =>
    async (response: Response): Promise<ArrayBufferLike> => {
      if (!response.headers.has("Content-Length")) {
        console.debug("No Content-Length");
        return response.arrayBuffer();
      }
      const length = parseInt(response.headers.get("Content-Length")!);
      console.debug(`Content-Length: ${length}b`);
      if (isNaN(length) || length < 4096) {
        return response.arrayBuffer();
      } // smaller sizes do not need progress
      progress(0.0);
      const output = ByteArrayOutput.create(length);
      const reader = asDefined(
        response.body,
        "response.body is empty",
      ).getReader();
        // eslint-disable-next-line no-constant-condition
        while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        value.forEach((value: byte) => output.writeByte(value));
        progress(output.position / length);
      }
      progress(1.0);
      return output.toArrayBuffer();
    };
}
