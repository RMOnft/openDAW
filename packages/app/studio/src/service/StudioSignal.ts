import {ProjectMeta} from "@/project/ProjectMeta"
import {Sample} from "@opendaw/studio-adapters"

/**
 * Events broadcast by {@link StudioService} to update various UI elements.
 * These complement the {@link SessionService} lifecycle and other session
 * oriented services.
 *
 * @remarks
 * The set is intentionally small but can grow as new UI elements are
 * introduced.
 *
 * ```mermaid
 * classDiagram
 *   class StudioSignal
 *   StudioSignal <|-- reset-peaks
 *   StudioSignal <|-- import-sample
 *   StudioSignal <|-- delete-project
 * ```
 */
export type StudioSignal =
    | {
    /** Request to reset all waveform peaks. */
    type: "reset-peaks"
} | {
    /** Import the given sample into the project. */
    type: "import-sample", sample: Sample
} | {
    /** Delete a project identified by its metadata. */
    type: "delete-project", meta: ProjectMeta
}
