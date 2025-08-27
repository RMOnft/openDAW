/**
 * Thin wrappers around the
 * [`CompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)
 * and `DecompressionStream` APIs.
 */
export namespace Compression {
    /**
     * Compresses an `ArrayBuffer` using the given format.
     *
     * @example
     * ```ts
     * const data = new TextEncoder().encode("hello").buffer;
     * const zipped = await Compression.encode(data);
     * ```
     */
    export const encode = async (buffer: ArrayBuffer, format: CompressionFormat = "gzip"): Promise<ArrayBuffer> => {
        const stream = new CompressionStream(format)
        const writer = stream.writable.getWriter()
        writer.write(new Uint8Array(buffer))
        writer.close()
        return new Response(stream.readable).arrayBuffer()
    }

    /**
     * Decompresses an `ArrayBuffer` created with {@link encode}.
     *
     * @example
     * ```ts
     * const restored = await Compression.decode(zipped);
     * ```
     */
    export const decode = async (buffer: ArrayBuffer, format: CompressionFormat = "gzip"): Promise<ArrayBuffer> => {
        const stream = new DecompressionStream(format)
        const writer = stream.writable.getWriter()
        writer.write(new Uint8Array(buffer))
        writer.close()
        return new Response(stream.readable).arrayBuffer()
    }
}
