/**
 * Runtime environment values needed when constructing a project.
 */
import {SampleManager} from "@opendaw/studio-adapters"

/**
 * Dependencies required for constructing a {@link Project}.
 *
 * @example
 * ```ts
 * const env: ProjectEnv = { sampleRate: 48000, sampleManager }
 * const project = Project.new(env)
 * ```
 * @public
 */
export interface ProjectEnv {
    /** Audio engine sample rate. */
    sampleRate: number
    /** Manager responsible for loading and caching samples. */
    sampleManager: SampleManager
}

