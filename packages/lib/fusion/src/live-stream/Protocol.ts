/**
 * Defines the messaging contract between a {@link LiveStreamBroadcaster}
 * and a {@link LiveStreamReceiver}. Implementations forward shared memory
 * references and update packets across thread boundaries.
 */
export interface Protocol {
    /** Share the lock used to coordinate access to the data buffer. */
    sendShareLock(lock: SharedArrayBuffer): void

    /** Transfer a new data buffer containing the actual stream values. */
    sendUpdateData(data: ArrayBufferLike): void

    /**
     * Send an updated structure description describing the layout of the
     * forthcoming data packages.
     */
    sendUpdateStructure(structure: ArrayBufferLike): void
}