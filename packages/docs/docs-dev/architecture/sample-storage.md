# Sample Storage

openDAW persists audio samples in the browser's [Origin Private File System](https://developer.mozilla.org/docs/Web/API/File_System_API/Origin_private_file_system) (OPFS). Each sample is stored in its own folder containing three files:

- `audio.wav` – the original audio data encoded as a WAV file
- `peaks.bin` – precomputed peaks used for waveform rendering
- `meta.json` – descriptive metadata such as name and bpm

```
samples/
└── v2/
    └── <uuid>/
        ├── audio.wav
        ├── peaks.bin
        └── meta.json
```

The [`SampleStorage` namespace](../../../packages/studio/core/src/samples/SampleStorage.ts) provides helper functions to read and write these files. `MainThreadSampleLoader` uses these helpers to cache downloads and serve subsequent requests directly from OPFS.

## Lifecycle

1. `SampleApi` downloads audio and metadata from the network.
2. `SampleStorage.store` writes the audio, peaks and metadata to OPFS.
3. `SampleStorage.load` reads the files back and decodes them into `AudioData` and peak information.
4. `SampleStorage.list` enumerates stored samples for the **Sample Browser**.

Clients may call `SampleStorage.remove` to free space or `SampleStorage.updateMeta` to adjust metadata without touching the audio.
