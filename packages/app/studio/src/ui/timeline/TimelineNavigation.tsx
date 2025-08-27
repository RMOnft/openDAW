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

const className = Html.adoptStyleSheet(css, "TimelineNavigation")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
}

/**
 * Hosts the loop editor and time axis used to navigate the timeline.
 *
 * @remarks
 * Place this component directly beneath the {@link TimelineHeader}.
 */
export const TimelineNavigation = ({lifecycle, service}: Construct) => {
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