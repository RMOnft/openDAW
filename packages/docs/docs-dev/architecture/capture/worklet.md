# Recording Worklet

The `RecordingWorklet` is an `AudioWorkletNode` that receives frames from a
`MediaStream` and writes them into a ring buffer. It also computes peak data so
waveforms can be displayed immediately after recording. Once finalized, the
worklet stores audio and peak information through the sample storage service.
