// We do not want to include DOM as a library in ts-config
// For some strange reason, crypto is not included in WebWorker

/**
 * Minimal `crypto` API surface used in the project.
 * This mirrors the subset of the Web Crypto API available in both
 * browser and worker contexts without pulling in the entire DOM lib.
 */
export type Crypto = {
    /** Web Crypto subtle API for hashing algorithms. */
    subtle: {
        /**
         * Computes a digest of the given data using the provided algorithm.
         * @param algorithm Name of the hash algorithm such as `SHA-256`.
         * @param data Data to digest.
         */
        digest(algorithm: string, data: ArrayBufferView | ArrayBuffer): Promise<ArrayBuffer>
    }
    /**
     * Fills the provided array with cryptographically strong random values.
     * @param array Typed array to populate.
     */
    getRandomValues<T extends ArrayBufferView | null>(array: T): T
}