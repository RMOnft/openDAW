import {PPQN} from "@opendaw/lib-dsp"

/**
 * Pulse–per–quarter-note resolution used by the {@link @opendaw/studio-core-processors#UpdateClock | UpdateClock} processor.
 *
 * @remarks
 * The constant defines how often the engine emits update events.  Adapters that
 * schedule parameter changes should use the same resolution so that the main
 * thread and the audio worklet remain in sync.
 *
 * @see {@link @opendaw/studio-core-processors#UpdateClock}
 */
export const UpdateClockRate = PPQN.fromSignature(1, 384)
