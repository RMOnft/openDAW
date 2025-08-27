/** Describes an OPFS entry type. */
export type Kind = "file" | "directory"

/** A single file system entry returned by {@link OpfsProtocol.list}. */
export type Entry = { name: string, kind: Kind }

/**
 * Contract describing operations supported by the OPFS worker.
 * Implementations perform synchronous file system tasks and return results
 * via promises to the main thread.
 */
export interface OpfsProtocol {
    /** Writes data to the given file path. */
    write(path: string, data: Uint8Array): Promise<void>
    /** Reads the contents of the specified file path. */
    read(path: string): Promise<Uint8Array>
    /** Removes a file or directory at the supplied path. */
    delete(path: string): Promise<void>
    /** Lists entries within the directory at the supplied path. */
    list(path: string): Promise<ReadonlyArray<Entry>>
}