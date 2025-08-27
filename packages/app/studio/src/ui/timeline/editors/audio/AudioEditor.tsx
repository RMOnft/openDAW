/**
 * Combines header and canvas to provide a simple audio clip editor for the
 * timeline. The editor renders a {@link AudioEditorHeader} with navigation
 * controls and an {@link AudioEditorCanvas} for waveform rendering.
 */
import {Lifecycle} from "@opendaw/lib-std"
import {createElement, Frag} from "@opendaw/lib-jsx"
import {StudioService} from "@/service/StudioService.ts"
import {AudioEditorHeader} from "@/ui/timeline/editors/audio/AudioEditorHeader.tsx"
import {AudioEditorCanvas} from "@/ui/timeline/editors/audio/AudioEditorCanvas.tsx"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"
import {Snapping} from "@/ui/timeline/Snapping.ts"
import {EditorMenuCollector} from "@/ui/timeline/editors/EditorMenuCollector.ts"
import {AudioEventOwnerReader} from "@/ui/timeline/editors/EventOwnerReader.ts"

/**
 * Construction options for {@link AudioEditor}.
 */
type Construct = {
    /** Lifecycle controlling subscriptions. */
    lifecycle: Lifecycle
    /** Access to the studio wide services. */
    service: StudioService
    /** Collector used to populate editor menus. */
    menu: EditorMenuCollector
    /** Range of the timeline to visualize. */
    range: TimelineRange
    /** Snapping helper used for grid alignment. */
    snapping: Snapping
    /** Reader exposing the currently edited audio event. */
    reader: AudioEventOwnerReader
}

/**
 * Renders the audio editor by stacking a header and canvas section.
 */
export const AudioEditor = ({lifecycle, service, range, snapping, reader}: Construct) => {
    return (
        <Frag>
            <AudioEditorHeader lifecycle={lifecycle}
                               service={service}/>
            <AudioEditorCanvas lifecycle={lifecycle}
                               service={service}
                               range={range}
                               snapping={snapping}
                               reader={reader}/>
        </Frag>
    )
}
