# Audio Decoding

The studio decodes imported audio files in order to generate waveforms and
make data available to playback components.

## Pipeline

1. `AudioImporter.run` receives a file's `ArrayBuffer`, decodes it with the
   Web Audio API and estimates metadata such as BPM and duration.
2. Peak information is generated in a worker via `WorkerAgents.Peak.generateAsync`.
3. `SampleStorage.store` persists the decoded audio, peaks and metadata in the
   browser's OPFS for later reuse.
4. `MainThreadSampleLoader` retrieves the cached data on demand and exposes
   it through a `SampleLoader` interface.

This workflow keeps heavy decoding work off the UI thread while ensuring
subsequent loads are served from the local cache.
