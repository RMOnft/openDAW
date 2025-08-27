/**
 * @packageDocumentation
 * DOM type augmentations supporting Fusion's messaging protocols.
 *
 * These definitions describe the Origin Private File System (OPFS) interfaces
 * required by {@link OpfsWorker} and its {@link OpfsProtocol}.
 */
declare global {
    /**
     * File handle with the ability to create a synchronous access handle used by
     * the OPFS channel.
     */
    interface FileSystemFileHandle {
        createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>
    }

    /**
     * Synchronous access handle used by the OPFS protocol to read and write
     * binary data.
     */
    interface FileSystemSyncAccessHandle {
        write(buffer: BufferSource, options?: { at?: number }): number
        read(buffer: BufferSource, options?: { at?: number }): number
        getSize(): number
        truncate(newSize: number): void
        flush(): void
        close(): void
    }

    /**
     * Provides access to storage-related features needed by the OPFS worker.
     */
    interface Navigator {
        readonly storage: StorageManager
    }

    /**
     * Allows retrieval of the root directory for OPFS operations.
     */
    interface StorageManager {
        getDirectory(): Promise<FileSystemDirectoryHandle>
    }
}

export {}
