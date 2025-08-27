import {Option, Terminable, UUID} from "@opendaw/lib-std"
import {ppqn} from "@opendaw/lib-dsp"
import {AnyClipBoxAdapter} from "./UnionAdapterTypes"

export type Section = {
    optClip: Option<AnyClipBoxAdapter>
    sectionFrom: ppqn
    sectionTo: ppqn
}

/**
 * Contract for clip sequencing components running in a worker.
 *
 * Implementations like {@link ClipSequencingAudioContext} manage clip state
 * off the main thread and yield the clips that should play for a given range.
 */
export interface ClipSequencing extends Terminable {
    iterate(trackKey: UUID.Format, a: ppqn, b: ppqn): Generator<Section>
}
