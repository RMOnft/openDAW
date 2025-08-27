import {FloatArray, int, Procedure} from "@opendaw/lib-std"

/** Contract exposed by the {@link SamplePeakWorker}. */
export interface SamplePeakProtocol {
    /**
     * Generates peak data for the provided frames. Progress is reported
     * between 0 and 1 via the given callback.
     */
    generateAsync(progress: Procedure<number>,
                  shifts: Uint8Array,
                  frames: ReadonlyArray<FloatArray>,
                  numFrames: int,
                  numChannels: int): Promise<ArrayBufferLike>
}