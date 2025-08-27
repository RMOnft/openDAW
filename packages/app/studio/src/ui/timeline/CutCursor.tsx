import css from "./CutCursor.sass?inline"
import {isDefined, Lifecycle, Nullable, ObservableValue} from "@opendaw/lib-std"
import {ppqn} from "@opendaw/lib-dsp"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

/** CSS class applied to the cursor element. */
const className = Html.adoptStyleSheet(css, "CutCursor")

/**
 * Constructor parameters for {@link CutCursor}.
 */
type Construct = {
    /** Lifecycle used to dispose subscriptions when the cursor is removed. */
    lifecycle: Lifecycle
    /** Timeline range that converts pulses into screen coordinates. */
    range: TimelineRange
    /**
     * Reactive playback position.  `null` hides the cursor while defined
     * values render the line at the corresponding pulse.
     */
    position: ObservableValue<Nullable<ppqn>>
}

/**
 * Renders a dashed vertical line indicating the current cut position.
 */
export const CutCursor = ({lifecycle, range, position}: Construct) => {
    const svg: SVGSVGElement = (
        <svg classList={className}>
            <line x1="0" y1="0" x2="0" y2="100%"
                  stroke="rgba(255,255,255,0.5)"
                  stroke-width="1"
                  stroke-dasharray="1,2"/>
        </svg>
    )
    /** Updates visibility and x-position based on the current pulse value. */
    const updater = () => {
        const value = position.getValue()
        if (isDefined(value)) {
            svg.style.left = `${Math.floor(range.unitToX(Math.max(value, 0))) + 1}px`
            svg.style.display = "block"
        } else {
            svg.style.display = "none"
        }
    }
    lifecycle.ownAll(position.subscribe(updater), Html.watchResize(svg, updater))
    // Initialize position immediately so that the cursor appears without delay.
    updater()
    return svg
}