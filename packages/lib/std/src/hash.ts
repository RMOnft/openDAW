import {assert} from "./lang"
import {Crypto} from "./crypto"

declare const crypto: Crypto

/**
 * Helper utilities around SHA‑256 hashing.  All functions operate on raw
 * `ArrayBuffer` instances to remain platform agnostic.
 */
export namespace Hash {
    /**
     * Concatenates the given buffers and returns their SHA‑256 digest.
     */
    export const fromBuffers = async (...buffers: ReadonlyArray<ArrayBufferLike>): Promise<ArrayBuffer> => {
        const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0)
        const mergedArray = new Uint8Array(totalLength)
        let offset = 0
        for (const buffer of buffers) {
            mergedArray.set(new Uint8Array(buffer), offset)
            offset += buffer.byteLength
        }
        return await crypto.subtle.digest("SHA-256", mergedArray)
    }

    /**
     * Compares two SHA‑256 hashes for byte equality.
     */
    export const equals = (a: ArrayBuffer, b: ArrayBuffer): boolean => {
        assert(a.byteLength === 32, "First hash has invalid length")
        assert(b.byteLength === 32, "Second hash has invalid length")
        const viewA = new Uint8Array(a)
        const viewB = new Uint8Array(b)
        for (let i = 0; i < 32; i++) {if (viewA[i] !== viewB[i]) {return false}}
        return true
    }

    /**
     * Returns a hexadecimal string representation of the hash contained in
     * {@link buffer}.
     */
    export const toString = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("")
}