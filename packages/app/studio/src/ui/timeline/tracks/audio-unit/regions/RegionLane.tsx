import css from "./RegionLane.sass?inline"
import {Html} from "@opendaw/lib-dom"
import {Lifecycle} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {CanvasPainter} from "@/ui/canvas/painter.ts"
import {renderRegions} from "@/ui/timeline/tracks/audio-unit/regions/RegionRenderer.ts"
import {TrackBoxAdapter} from "@opendaw/studio-adapters"
import {TracksManager} from "@/ui/timeline/tracks/audio-unit/TracksManager.ts"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"
import {TrackType} from "@opendaw/studio-adapters"

const className = Html.adoptStyleSheet(css, "RegionLane")

/**
 * Construction parameters for {@link RegionLane}.
 */
type Construct = {
    /** Lifecycle managing subscriptions. */
    lifecycle: Lifecycle
    /** Track manager used to resolve region data. */
    trackManager: TracksManager
    /** Visible range of the timeline. */
    range: TimelineRange
    /** Adapter of the track whose regions are rendered. */
    adapter: TrackBoxAdapter
}

/**
 * Displays region previews for a single track using a canvas renderer.
 */
export const RegionLane = ({lifecycle, trackManager, range, adapter}: Construct) => {
    if (adapter.type === TrackType.Undefined) {
        return <div className={Html.buildClassList(className, "deactive")}/>
    }
    let updated = false
    let visible = false
    const canvas: HTMLCanvasElement = <canvas/>
    const element: Element = (<div className={className}>{canvas}</div>)
    const painter = lifecycle.own(new CanvasPainter(canvas, ({context}) => {
        if (visible) {
            renderRegions(context, trackManager, range, adapter.listIndex)
            updated = true
        }
    }))
    const requestUpdate = () => {
        updated = false
        painter.requestUpdate()
    }
    lifecycle.ownAll(
        range.subscribe(requestUpdate),
        adapter.regions.subscribeChanges(requestUpdate),
        Html.watchIntersection(element, entries => entries
                .forEach(({isIntersecting}) => {
                    visible = isIntersecting
                    if (!updated) {
                        painter.requestUpdate()
                    }
                }),
            {root: trackManager.scrollableContainer})
    )
    return element
}