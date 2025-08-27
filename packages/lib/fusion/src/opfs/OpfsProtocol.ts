/** Indicates the type of an OPFS entry. */
export type Kind = "file" | "directory"

/** Name and {@link Kind} pair returned by {@link OpfsProtocol.list}. */
export type Entry = { name: string, kind: Kind }

/**
 * Minimal protocol used to interact with the Origin Private File System.
 *
 * Implementations can be used both inside a worker and on the main thread.
 */
export interface OpfsProtocol {
    /** Write a file to the given path. */
    write(path: string, data: Uint8Array): Promise<void>

    /** Read an entire file from the given path. */
    read(path: string): Promise<Uint8Array>

    /** Remove a file or directory tree at the given path. */
    delete(path: string): Promise<void>

    /** List entries below the given directory path. */
    list(path: string): Promise<ReadonlyArray<Entry>>
}
