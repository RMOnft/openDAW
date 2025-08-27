import {Progress, UUID} from "@opendaw/lib-std"
import {Sample} from "@opendaw/studio-adapters"

/**
 * Interface for importing audio samples into a project.
 *
 * @example
 * ```ts
 * await importer.importSample({uuid, name: "kick", arrayBuffer})
 * ```
 */
export type SampleImporter = {
    /**
     * Store a sample within the project.
     *
     * @param sample.uuid Unique identifier for the sample.
     * @param sample.name User visible name.
     * @param sample.arrayBuffer Raw audio data.
     * @param sample.progressHandler Optional progress updates during encoding.
     * @returns The imported sample descriptor.
     */
    importSample(sample: {
        uuid: UUID.Format,
        name: string,
        arrayBuffer: ArrayBuffer,
        progressHandler?: Progress.Handler
    }): Promise<Sample>
}
