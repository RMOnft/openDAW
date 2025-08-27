import {Option, Terminable, UUID} from "@opendaw/lib-std"
import {ppqn} from "@opendaw/lib-dsp"
import {AnyClipBoxAdapter} from "./UnionAdapterTypes"

/**
 * A section of the timeline that may contain an optional clip.
 */
export type Section = {
    /** Possible clip adapter active in this section. */
    optClip: Option<AnyClipBoxAdapter>
    /** Start position of the section in PPQN. */
    sectionFrom: ppqn
    /** End position of the section in PPQN. */
    sectionTo: ppqn
}

/**
 * Contract for clip sequencing components running in a worker.
 *
 * Implementations like {@link ClipSequencingAudioContext} manage clip state
 * off the main thread and yield the clips that should play for a given range.

 */
export interface ClipSequencing extends Terminable {
    /**
     * Returns all clip sections that intersect the given range.
     *
     * @param trackKey - Identifier of the track to query
     * @param a - start position in PPQN
     * @param b - end position in PPQN
     */
    iterate(trackKey: UUID.Format, a: ppqn, b: ppqn): Generator<Section>
}
