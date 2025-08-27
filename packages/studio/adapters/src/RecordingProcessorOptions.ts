import {RingBuffer} from "./RingBuffer"

/**
 * Configuration for the {@link @opendaw/studio-core-processors#RecordingProcessor | RecordingProcessor}.
 *
 * @remarks
 * These options describe the shared audio {@link RingBuffer} that transfers
 * recorded data from the audio worklet to the main thread.
 */
export interface RecordingProcessorOptions extends RingBuffer.Config {}

