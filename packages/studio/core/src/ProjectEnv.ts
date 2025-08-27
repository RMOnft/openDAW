import {SampleManager} from "@opendaw/studio-adapters"

/**
 * Dependencies required for constructing a {@link Project}.
 *
 * @public
 */
export interface ProjectEnv {
    /** Audio engine sample rate. */
    sampleRate: number
    /** Manager responsible for loading and caching samples. */
    sampleManager: SampleManager
}
