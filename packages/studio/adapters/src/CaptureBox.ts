import {CaptureAudioBox, CaptureMidiBox} from "@opendaw/studio-boxes"

/**
 * Union type for capture boxes used by the {@link @opendaw/studio-core-processors#RecordingProcessor | RecordingProcessor}.
 *
 * @remarks
 * A capture box holds either audio or MIDI data waiting to be recorded. The
 * corresponding processor reads from these boxes and writes the content to a
 * {@link RecordingProcessorOptions | ring buffer}.
 */
export type CaptureBox = CaptureAudioBox | CaptureMidiBox
