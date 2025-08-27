import {PPQN} from "@opendaw/lib-dsp"

/**
 * Tick rate used by the worker-side {@link UpdateClock} processor to emit
 * regular update events back to the main thread.
 */
export const UpdateClockRate = PPQN.fromSignature(1, 384)
