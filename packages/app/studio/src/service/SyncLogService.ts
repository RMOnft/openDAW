import {FilePickerAcceptTypes} from "@/ui/FilePickerAcceptTypes.ts"
import {FooterLabel} from "@/service/FooterLabel"
import {asDefined, Exec, isDefined} from "@opendaw/lib-std"
import {Promises} from "@opendaw/lib-runtime"
import {StudioService} from "@/service/StudioService"
import {Commit, SyncLogReader, SyncLogWriter} from "@opendaw/studio-core"

/**
 * Service helpers for writing and appending project SyncLog files. Intended to
 * be used alongside the {@link SessionService} to persist collaborative
 * session history.
 *
 * ```mermaid
 * flowchart LR
 *   A[start] -->|start| B[New SyncLog]
 *   A2[existing] -->|append| B
 * ```
 */
export namespace SyncLogService {
    /**
     * Start a new SyncLog and attach it to the current project.
     *
     * @param service - Studio service providing the project context.
     * @returns Promise resolving when the SyncLog is ready.
     */
    export const start = async (service: StudioService) => {
        if (!isDefined(window.showSaveFilePicker)) {return}
        const {
            status,
            value: handle
        } = await Promises.tryCatch(window.showSaveFilePicker({
            suggestedName: "New.odsl",
            ...FilePickerAcceptTypes.ProjectSyncLog
        }))
        if (status === "rejected") {return}
        service.cleanSlate()
        const label: FooterLabel = asDefined(service.factoryFooterLabel().unwrap()())
        label.setTitle("SyncLog")
        let count = 0 | 0
        SyncLogWriter.attach(service.project, wrapBlockWriter(handle, () => label.setValue(`${++count} commits`)))
    }

    /**
     * Append commits to an existing SyncLog file selected by the user.
     *
     * @param service - Studio service providing the project context.
     * @returns Promise resolving when all commits have been appended.
     */
    export const append = async (service: StudioService) => {
        const openResult = await Promises.tryCatch(window.showOpenFilePicker(FilePickerAcceptTypes.ProjectSyncLog))
        if (openResult.status === "rejected") {return}
        const handle = asDefined(openResult.value[0], "No handle")
        const queryPermissionResult = await Promises.tryCatch(handle.queryPermission({mode: "readwrite"}))
        if (queryPermissionResult.status === "rejected") {
            console.warn(queryPermissionResult.error)
            // do not return
        } else {
            console.debug("queryPermission", queryPermissionResult.value)
        }
        const requestPermissionResult = await Promises.tryCatch(handle.requestPermission({mode: "readwrite"}))
        if (requestPermissionResult.status === "rejected") {
            console.warn("permission-status", requestPermissionResult.error)
            return
        }
        if (requestPermissionResult.value !== "granted") {
            console.warn("permission-value", requestPermissionResult.value)
            return
        }
        const arrayBufferResult = await Promises.tryCatch(handle.getFile().then(x => x.arrayBuffer()))
        if (arrayBufferResult.status === "rejected") {
            console.warn("arrayBuffer", arrayBufferResult.error)
            return
        }
        const {project, lastCommit, numCommits} = await SyncLogReader.unwrap(service, arrayBufferResult.value)
        service.fromProject(project, "SyncLog")
        const label: FooterLabel = asDefined(service.factoryFooterLabel().unwrap()())
        label.setTitle("SyncLog")
        let count = numCommits
        SyncLogWriter.attach(service.project, wrapBlockWriter(handle, () => label.setValue(`${++count} commits`)), lastCommit)
    }

    /**
     * Creates a block writer that serializes commits to the given file handle.
     *
     * @param handle - Destination file handle.
     * @param callback - Invoked after each commit has been queued.
     * @returns Observer function passed to {@link SyncLogWriter.attach}.
     */
    const wrapBlockWriter = (handle: FileSystemFileHandle, callback: Exec) => {
        let blocks: Array<Commit> = []
        let lastPromise: Promise<void> = Promise.resolve()
        return (commit: Commit): void => {
            blocks.push(commit)
            callback()
            lastPromise = lastPromise.then(async () => {
                const writable: FileSystemWritableFileStream = await handle.createWritable({keepExistingData: true})
                const file = await handle.getFile()
                await writable.seek(file.size)
                const buffers = blocks.map(block => block.serialize())
                blocks = []
                await writable.write(appendArrayBuffers(buffers))
                await writable.close()
            })
        }
    }

    /**
     * Concatenates multiple {@link ArrayBuffer} instances into one.
     *
     * @param buffers - Buffers in the order they should appear.
     * @returns Combined buffer containing all input data.
     */
    const appendArrayBuffers = (buffers: ReadonlyArray<ArrayBuffer>): ArrayBuffer => {
        const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0)
        const result = new Uint8Array(totalLength)
        buffers.reduce((offset, buffer) => {
            result.set(new Uint8Array(buffer), offset)
            return offset + buffer.byteLength
        }, 0)
        return result.buffer
    }
}