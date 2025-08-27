import css from "./MarkerTrackHeader.sass?inline"
import {Html} from "@opendaw/lib-dom"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "MarkerTrackHeader")

/**
 * Renders the "Markers" label in the track header column.
 */
export const MarkerTrackHeader = () => {
    return (<div className={className}>Markers</div>)
}
