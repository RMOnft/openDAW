import {Progress, UUID} from "@opendaw/lib-std"
import {Sample} from "@opendaw/studio-adapters"

/**
 * Interface for importing audio samples into a project.
 *
 * @example
 * ```ts
 * await importer.importSample({uuid, name: "kick", arrayBuffer})
 * ```
 *
 * @see SampleUtils.verify
 * @see SampleDialogs.missingSampleDialog
 */
export type SampleImporter = {
    importSample(sample: {
        uuid: UUID.Format,
        name: string,
        arrayBuffer: ArrayBuffer,
        progressHandler?: Progress.Handler
    }): Promise<Sample>
}
