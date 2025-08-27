import {Arrays, asDefined} from "@opendaw/lib-std"
import {Communicator, Messenger, Promises} from "@opendaw/lib-runtime"
import {Entry, OpfsProtocol} from "./OpfsProtocol"
import "../types"

/**
 * Helper utilities for interacting with the Origin Private File System (OPFS)
 * inside a Web Worker. All file system operations are funneled through
 * {@link Communicator.executor} to serialize access and avoid race
 * conditions.
 */
export namespace OpfsWorker {
    const DEBUG = false
    const readLimiter = new Promises.Limit<Uint8Array>(1)
    const writeLimiter = new Promises.Limit<void>(1)

    /**
     * Register the OPFS protocol handlers on the given messenger channel.
     *
     * @param messenger messenger used to communicate with the worker host.
     */
    export const init = (messenger: Messenger) =>
        Communicator.executor(messenger.channel("opfs"), new class implements OpfsProtocol {
            /**
             * Write a file to the OPFS at the given path.
             *
             * @param path slash-delimited file path inside the OPFS root.
             * @param data contents to store.
             */
            async write(path: string, data: Uint8Array): Promise<void> {
                if (DEBUG) {console.debug(`write ${data.length}b to ${path}`)}
                return writeLimiter.add(() => this.#resolveFile(path, {create: true})
                    .then(handle => {
                        handle.truncate(data.length)
                        handle.write(data.buffer as ArrayBuffer, {at: 0})
                        handle.flush()
                        handle.close()
                    }))
            }

            /**
             * Read a file from the OPFS.
             *
             * @param path slash-delimited file path inside the OPFS root.
             * @returns file contents as a new {@link Uint8Array}.
             */
            async read(path: string): Promise<Uint8Array> {
                if (DEBUG) {console.debug(`read ${path}`)}
                return readLimiter.add(() => this.#resolveFile(path)
                    .then(handle => {
                        const size = handle.getSize()
                        const buffer = new Uint8Array(size)
                        handle.read(buffer)
                        handle.close()
                        return buffer
                    }))
            }

            /**
             * Remove a file or directory tree at the given path.
             */
            async delete(path: string): Promise<void> {
                const segments = pathToSegments(path)
                return this.#resolveFolder(segments.slice(0, -1))
                    .then(folder => folder.removeEntry(asDefined(segments.at(-1)), {recursive: true}))
            }

            /**
             * List directory entries below the given path.
             */
            async list(path: string): Promise<ReadonlyArray<Entry>> {
                const segments = pathToSegments(path)
                const {status, value: folder} = await Promises.tryCatch(this.#resolveFolder(segments))
                if (status === "rejected") {return Arrays.empty()}
                const result: Array<Entry> = []
                for await (const {name, kind} of folder.values()) {
                    result.push({name, kind})
                }
                return result
            }

            /** Resolve a file handle and open a sync access handle. */
            async #resolveFile(path: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemSyncAccessHandle> {
                const segments = pathToSegments(path)
                return this.#resolveFolder(segments.slice(0, -1), options)
                    .then((folder) => folder.getFileHandle(asDefined(segments.at(-1)), options)
                        .then(handle => handle.createSyncAccessHandle()))
            }

            /** Traverse the directory structure for the given path segments. */
            async #resolveFolder(segments: ReadonlyArray<string>,
                                 options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle> {
                let folder: FileSystemDirectoryHandle = await navigator.storage.getDirectory()
                for (const segment of segments) {folder = await folder.getDirectoryHandle(segment, options)}
                return folder
            }
        })

    /** Split a slash-delimited path into individual segments. */
    const pathToSegments = (path: string): ReadonlyArray<string> => {
        const noSlashes = path.replace(/^\/+|\/+$/g, "")
        return noSlashes === "" ? [] : noSlashes.split("/")
    }
}
