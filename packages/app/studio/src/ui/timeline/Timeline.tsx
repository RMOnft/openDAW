import css from "./Timeline.sass?inline"
import {Lifecycle} from "@opendaw/lib-std"
import {createElement, Inject} from "@opendaw/lib-jsx"
import {StudioService} from "@/service/StudioService"
import {TracksFooter} from "@/ui/timeline/tracks/footer/TracksFooter.tsx"
import {TimelineHeader} from "@/ui/timeline/TimelineHeader.tsx"
import {TimelineNavigation} from "@/ui/timeline/TimelineNavigation.tsx"
import {PrimaryTracks} from "./tracks/primary/PrimaryTracks"
import {AudioUnitsTimeline} from "./tracks/audio-unit/AudioUnitsTimeline.tsx"
import {ClipsHeader} from "@/ui/timeline/tracks/audio-unit/clips/ClipsHeader.tsx"
import {ppqn} from "@opendaw/lib-dsp"
import {Html} from "@opendaw/lib-dom"

/** CSS class applied to the outer timeline container. */
const className = Html.adoptStyleSheet(css, "Timeline")

/** Parameters for constructing the {@link Timeline} component. */
type Construct = {
    /** Lifecycle used to dispose observers. */
    lifecycle: Lifecycle
    /** Service providing timeline and engine state. */
    service: StudioService
}

/**
 * Renders the main timeline view for the studio.
 *
 * @remarks
 * Combines the header, navigation and track displays into a single grid
 * element and wires up resize and playback observers.
 *
 * @example
 * ```tsx
 * <Timeline lifecycle={lifecycle} service={studioService} />
 * ```
 */
export const Timeline = ({lifecycle, service}: Construct) => {
    const {timeline, engine} = service
    const {snapping, clips, followPlaybackCursor, primaryVisible} = timeline
    const snappingName = Inject.value(snapping.unit.name)
    lifecycle.own(snapping.subscribe(snapping => {snappingName.value = snapping.unit.name}))
    const timelineHeader = <TimelineHeader lifecycle={lifecycle} service={service}/>
    const tracksFooter = <TracksFooter lifecycle={lifecycle} service={service}/>
    const element: HTMLElement = (
        <div className={className}>
            {timelineHeader}
            <ClipsHeader lifecycle={lifecycle} service={service}/>
            <TimelineNavigation lifecycle={lifecycle} service={service}/>
            <PrimaryTracks lifecycle={lifecycle} service={service}/>
            <AudioUnitsTimeline lifecycle={lifecycle} service={service}/>
            {tracksFooter}
        </div>
    )
    // Toggle CSS state based on the engine's recording flags.
    const updateRecordingState = () =>
        element.classList.toggle("recording", engine.isRecording.getValue() || engine.isCountingIn.getValue())
    lifecycle.ownAll(
        Html.watchResize(element, () => {
            const cursorHeight = element.clientHeight
                - timelineHeader.clientHeight
                - tracksFooter.clientHeight
            element.style.setProperty("--cursor-height", `${cursorHeight - 1}px`)
        }),
        engine.isRecording.subscribe(updateRecordingState),
        engine.isCountingIn.subscribe(updateRecordingState),
        engine.position.subscribe((() => {
            let lastPosition: ppqn = 0
            return owner => {
                if (!followPlaybackCursor.getValue()) {return}
                const range = service.timeline.range
                const position = owner.getValue()
                if (lastPosition <= range.unitMax && position > range.unitMax) {
                    range.moveUnitBy(range.unitMax - range.unitMin)
                } else if (lastPosition >= range.unitMin && position < range.unitMin) {
                    range.moveUnitBy(range.unitMin - range.unitMax)
                }
                lastPosition = position
            }
        })()),
        clips.visible.catchupAndSubscribe(owner => { return element.classList.toggle("clips-visible", owner.getValue()) }),
        clips.count.catchupAndSubscribe(owner => element.style.setProperty("--clips-count", String(owner.getValue()))),
        primaryVisible.catchupAndSubscribe((owner) => element.classList.toggle("primary-tracks-visible", owner.getValue()))
    )
    return element
}