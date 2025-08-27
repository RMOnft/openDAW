/**
 * Helper functions for installing the main editor body and providing
 * scrolling and range management common to all timeline editors.
 */
import {Terminable} from "@opendaw/lib-std"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"
import {PPQN} from "@opendaw/lib-dsp"
import {attachWheelScroll} from "@/ui/timeline/editors/WheelScroll.ts"
import {installAutoScroll} from "@/ui/AutoScroll.ts"
import {Config} from "@/ui/timeline/Config.ts"
import {EventOwnerReader} from "./EventOwnerReader.ts"
import {Html} from "@opendaw/lib-dom"

/**
 * Arguments used when wiring an editor body to the DOM and timeline range.
 */
export type Construct = {
    element: Element
    range: TimelineRange
    reader: EventOwnerReader<unknown>
}

/**
 * Installs handlers for the main editor area. The range is adjusted to fit
 * the edited content and wheel/auto scrolling behaviour is enabled.
 */
export const installEditorMainBody = ({element, range, reader}: Construct): Terminable => {
    let init = true
    return Terminable.many(
        Html.watchResize(element, () => {
            range.width = element.clientWidth
            if (init) {
                init = false
                range.zoomRange(reader.offset, reader.offset + reader.loopDuration + PPQN.Bar, 16)
            }
        }),
        installEditorAuxBody(element, range),
        reader.watchOverlap(range)
    )
}

// This is for extra editor that also need wheel and auto-scroll support
// Currently: PropertyEditor within NoteEditor
/**
 * Installs scroll behaviour for auxiliary editor sections that require
 * wheel and auto scrolling support but do not manage their own range.
 */
export const installEditorAuxBody = (element: Element, range: TimelineRange): Terminable => {
    return Terminable.many(
        attachWheelScroll(element, range),
        installAutoScroll(element, (deltaX, _deltaY) => {
            if (deltaX !== 0) {range.moveUnitBy(deltaX * range.unitsPerPixel * Config.AutoScrollHorizontalSpeed)}
        }, {padding: Config.AutoScrollPadding})
    )
}