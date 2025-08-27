import {AudioRegionBoxAdapter} from "./timeline/region/AudioRegionBoxAdapter"
import {NoteRegionBoxAdapter} from "./timeline/region/NoteRegionBoxAdapter"
import {ValueRegionBoxAdapter} from "./timeline/region/ValueRegionBoxAdapter"
import {NoteClipBoxAdapter} from "./timeline/clip/NoteClipBoxAdapter"
import {ValueClipBoxAdapter} from "./timeline/clip/ValueClipBoxAdapter"
import {AudioClipBoxAdapter} from "./timeline/clip/AudioClipBoxAdapter"
import {BoxAdapter} from "./BoxAdapter"
import {UnionBoxTypes} from "./unions"

/** Union type of any clip adapter. */
export type AnyClipBoxAdapter = NoteClipBoxAdapter | ValueClipBoxAdapter | AudioClipBoxAdapter

/** Union type of any region adapter. */
export type AnyRegionBoxAdapter = NoteRegionBoxAdapter | ValueRegionBoxAdapter | AudioRegionBoxAdapter
/** Region adapter that supports looping. */
export type AnyLoopableRegionBoxAdapter = AnyRegionBoxAdapter // TODO Clarify

/**
 * Type guards for working with unions of adapter types.
 */
export const UnionAdapterTypes = {
    /** Returns true when the adapter wraps a region box. */
    isRegion: (adapter: BoxAdapter): adapter is AnyRegionBoxAdapter =>
        UnionBoxTypes.isRegionBox(adapter.box),
    /** Returns true when the adapter wraps a loopable region. */
    isLoopableRegion: (adapter: BoxAdapter): adapter is AnyLoopableRegionBoxAdapter =>
        UnionBoxTypes.isLoopableRegionBox(adapter.box)
}
