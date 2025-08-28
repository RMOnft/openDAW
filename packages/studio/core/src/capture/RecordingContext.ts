import {Provider} from "@opendaw/lib-std"
import {SampleManager} from "@opendaw/studio-adapters"
import {Project} from "../Project"
import {Engine} from "../Engine"
import {Worklets} from "../Worklets"

/**
 * Runtime dependencies required by the recording subsystem.
 */
export interface RecordingContext {
    /** Project being recorded into. */
    project: Project
    /** Worklet factory used to create processing nodes. */
    worklets: Worklets
    /** Engine that manages transport and scheduling. */
    engine: Engine
    /** Audio context providing the clock and media graph. */
    audioContext: AudioContext
    /** Handles sample persistence. */
    sampleManager: SampleManager
    /** Provider used to request MIDI access when needed. */
    requestMIDIAccess: Provider<Promise<MIDIAccess>>
}