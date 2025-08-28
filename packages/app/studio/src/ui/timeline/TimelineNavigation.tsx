/**
 * Navigation bar for the timeline.  It combines the loop area editor and the
 * time axis and is typically rendered directly beneath the header.
 */
import css from "./TimelineNavigation.sass?inline"
import {Lifecycle} from "@opendaw/lib-std"
import {StudioService} from "@/service/StudioService.ts"
import {LoopAreaEditor} from "@/ui/timeline/LoopAreaEditor.tsx"
import {TimeAxis} from "@/ui/timeline/TimeAxis.tsx"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

/** CSS class applied to the navigation container. */
const className = Html.adoptStyleSheet(css, "TimelineNavigation")

/** Parameters for constructing {@link TimelineNavigation}. */
type Construct = {
    /** Lifecycle controlling nested components. */
    lifecycle: Lifecycle
    /** Application service providing timeline state. */
    service: StudioService
}

/**
 * Hosts the loop editor and time axis used to navigate the timeline.
 *
 * @remarks
 * Place this component directly beneath the {@link TimelineHeader}.
 *
 * @param lifecycle Controls the lifetime of nested components.
 * @param service Application service providing timeline state.
 */
export const TimelineNavigation = ({ lifecycle, service }: Construct) => {
    const {range, snapping} = service.timeline
    const {editing, timelineBox} = service.project
    return (
        <div className={className}>
            <LoopAreaEditor lifecycle={lifecycle}
                            range={range}
                            snapping={snapping}
                            editing={editing}
                            loopArea={timelineBox.loopArea}/>
            <TimeAxis lifecycle={lifecycle} service={service}
                      snapping={snapping}
                      range={range}/>
        </div>
    )
}
