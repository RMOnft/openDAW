# Peaks

The peaks utilities generate multi-resolution waveform overviews.

* `SamplePeakWorker` computes peak data from raw audio frames.
* `Peaks` structures the data for quick lookups.
* `PeaksPainter` renders the peaks onto a canvas.

```ts
const worker = SamplePeakWorker.install(messenger)
const buffer = await protocol.generateAsync(progress, shifts, frames, numFrames, numChannels)
const peaks = SamplePeaks.from(new ByteArrayInput(buffer))
```
