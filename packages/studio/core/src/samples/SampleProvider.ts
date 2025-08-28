import {Progress, UUID} from "@opendaw/lib-std"
import {AudioData, SampleMetaData} from "@opendaw/studio-adapters"

/**
 * Source of sample data for the {@link MainThreadSampleManager}.
 */
export interface SampleProvider {
    /**
     * Retrieve a sample and associated metadata.
     *
     * @param uuid identifier of the requested sample
     * @param progress callback receiving download progress between 0 and 1
     * @returns Tuple containing decoded audio and metadata for the sample.
     */
    fetch(uuid: UUID.Format, progress: Progress.Handler): Promise<[AudioData, SampleMetaData]>
}
