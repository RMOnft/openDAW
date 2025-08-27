import {BoxSchema} from "@opendaw/lib-box-forge"
import {Pointers} from "@opendaw/studio-enums"

/**
 * Box describing a reference to an audio file on disk.
 *
 * ```mermaid
 * graph TD
 *   AudioFileBox -->|file-name| File
 *   AudioFileBox -->|start/end| Timeline
 * ```
 */
export const AudioFileBox: BoxSchema<Pointers> = {
    type: "box",
    class: {
        name: "AudioFileBox",
        fields: {
            1: {type: "int32", name: "start-in-seconds"}, // deprecate
            2: {type: "int32", name: "end-in-seconds"}, // deprecate
            3: {type: "string", name: "file-name"}
        }
    }, pointerRules: {accepts: [Pointers.AudioFile], mandatory: true}
}