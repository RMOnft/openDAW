import { int } from "@opendaw/lib-std";

export namespace Stream {
  /**
   * Reads an entire {@link ReadableStream} into a single {@link ArrayBuffer}.
   *
   * Error Handling: any failure while reading will reject the returned
   * promise. Callers are responsible for handling stream errors.
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
