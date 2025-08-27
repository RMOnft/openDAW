# Fusion Examples

```ts
// Broadcast microphone input to connected receivers
const broadcaster = new LiveStreamBroadcaster(port)
await broadcaster.start(stream)

// Request waveform peaks
const worker = new SamplePeakWorker()
const peaks = await worker.generate(buffer)

// Use OPFS through a worker
const opfs = new OpfsWorker()
await opfs.writeFile('demo.wav', data)
```

More details are available in the [OPFS](opfs.md),
[Live Stream](live-stream.md) and [Peaks](peaks.md) guides.
