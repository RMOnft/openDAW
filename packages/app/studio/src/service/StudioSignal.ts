import {ProjectMeta} from "@/project/ProjectMeta"
import {Sample} from "@opendaw/studio-adapters"

/**
 * Events broadcast by {@link StudioService} to update various UI elements.
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
    type: "reset-peaks"
} | {
    type: "import-sample", sample: Sample
} | {
    type: "delete-project", meta: ProjectMeta
}