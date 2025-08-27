/**
 * Utility for resolving pointer positions to specific region handles.  Used by
 * editors to determine whether a drag should move a region, resize it or adjust
 * its loop.
 */
import {
    AnyLoopableRegionBoxAdapter,
    AnyRegionBoxAdapter,
    UnionAdapterTypes
} from "@opendaw/studio-adapters"
import {ElementCapturing} from "@/ui/canvas/capturing.ts"
import {isDefined, Nullable, Option, Provider} from "@opendaw/lib-std"
import {PointerRadiusDistance} from "@/ui/timeline/constants.ts"
import {TimelineRange} from "../TimelineRange"

/**
 * Different interactive targets around a region. These values are returned
 * by the capturing system to indicate which part of the region the user
 * is manipulating.
 */
export type CaptureTarget =
    | { type: "region-position", region: AnyRegionBoxAdapter }
    | { type: "region-start", region: AnyLoopableRegionBoxAdapter }
    | { type: "region-complete", region: AnyRegionBoxAdapter }
    | { type: "loop-duration", region: AnyRegionBoxAdapter }

/**
 * Creates an {@link ElementCapturing} helper that resolves pointer
 * coordinates to region manipulation targets used for moving or
 * resizing regions on the timeline.
 */
export const createRegionCapturing = (canvas: Element,
                                      regionProvider: Provider<Option<AnyRegionBoxAdapter>>,
                                      range: TimelineRange) => new ElementCapturing<CaptureTarget>(canvas, {
    capture: (x: number, _y: number): Nullable<CaptureTarget> => {
        const trackAdapter = regionProvider().unwrapOrNull()?.trackBoxAdapter?.unwrapOrNull()
        if (!isDefined(trackAdapter)) {return null}
        const position = Math.floor(range.xToUnit(x))
        const region = trackAdapter.regions.collection.lowerEqual(position)
        if (region === null || position >= region.complete) {return null}
        const x0 = range.unitToX(region.position)
        const x1 = range.unitToX(region.complete)
        if (x1 - x0 <= PointerRadiusDistance * 4) {
            // too small to have other sensitive areas
            return {type: "region-position", region}
        }
        if (UnionAdapterTypes.isLoopableRegion(region)) {
            if (x - x0 < PointerRadiusDistance * 2) {
                return {type: "region-start", region}
            } else if (Math.abs(x - range.unitToX(region.offset + region.loopDuration)) <= PointerRadiusDistance) {
                return {type: "loop-duration", region}
            } else if (x1 - x < PointerRadiusDistance * 2) {
                return {type: "region-complete", region}
            }
        }
        return {type: "region-position", region}
    }
})
