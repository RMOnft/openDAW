import {BoxSchema} from "@opendaw/lib-box-forge"
import {Pointers} from "@opendaw/studio-enums"

/**
 * Associates a `selection` container with the `selectable` subject.
 *
 * ```mermaid
 * graph LR
 *   SelectionBox --> selection
 *   SelectionBox --> selectable
 * ```
 */
export const SelectionBox: BoxSchema<Pointers> = {
    type: "box",
    class: {
        name: "SelectionBox",
        fields: {
            1: {type: "pointer", name: "selection", pointerType: Pointers.Selection, mandatory: true},
            2: {type: "pointer", name: "selectable", pointerType: Pointers.Selection, mandatory: true}
        }
    }
}