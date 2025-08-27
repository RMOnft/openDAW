import {Events} from "@opendaw/lib-dom"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"

/**
 * Enables horizontal scrolling of the timeline using the mouse wheel.
 * Small wheel movements within a threshold are ignored to prevent
 * accidental scrolling.
 */
export const attachWheelScroll = (element: Element, range: TimelineRange) =>
    Events.subscribe(element, "wheel", (event: WheelEvent) => {
        const deltaX = event.deltaX
        const ratio = 0.0001
        const threshold = 1.0
        const clamped = Math.max(deltaX - threshold, 0.0) + Math.min(deltaX + threshold, 0.0)
        if (Math.abs(clamped) > 0) {
            event.preventDefault()
            range.moveBy(clamped * ratio)
        }
    }, {passive: false})