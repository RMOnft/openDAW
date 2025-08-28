# Audio Capture

`CaptureAudio` wraps a browser `MediaStream` to provide microphone and line
input. When armed, it requests a stream matching the desired device and channel
configuration and feeds the data into a [`RecordingWorklet`](./worklet.md).

Levels can be adjusted via a software gain stage before samples are written to
the recording buffer.
