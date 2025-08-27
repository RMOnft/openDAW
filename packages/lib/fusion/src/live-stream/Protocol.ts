/**
 * Messaging contract used between the broadcaster and receiver. All methods
 * forward updates over a shared channel without awaiting a response.
 */
export interface Protocol {
    /** Shares the lock that synchronises read/write access to data buffers. */
    sendShareLock(lock: SharedArrayBuffer): void
    /** Sends the data buffer containing audio frames. */
    sendUpdateData(data: ArrayBufferLike): void
    /** Sends structural information about the current stream layout. */
    sendUpdateStructure(structure: ArrayBufferLike): void
}