/**
 * Utilities for working with `ReadableStream` objects.
 *
 * @example
 * ```ts
 * const reader = response.body!.getReader();
 * const buffer = await Stream.read(reader);
 * ```
 */
import { int } from "@opendaw/lib-std";

export namespace Stream {
  /**
   * Reads all chunks from a `ReadableStreamDefaultReader` into a single
   * `ArrayBuffer`.
   */
  export const read = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ): Promise<ArrayBuffer> => {
    const chunks: Array<Uint8Array> = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
    const length = chunks.reduce((acc, val) => acc + val.length, 0);
    const output = new Uint8Array(length);
    let position: int = 0 | 0;
    for (let chunk of chunks) {
      output.set(chunk, position);
      position += chunk.length;
    }
    return output.buffer;
  };
}
