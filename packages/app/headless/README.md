# openDAW Headless

A minimal build of openDAW that runs entirely in the browser without any UI.
It demonstrates booting the audio engine and playing a simple project.

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:8080> in a compatible browser. Clicking the page will
start playback of the example project.

## API references

- `src/SampleApi.ts` – helpers for fetching sample metadata and audio data.
- `src/features.ts` – feature detection used during start‑up.
- `src/ExampleProject.ts` – constructs the demo project programmatically.
- `src/main.ts` – entry point that wires everything together.
- `public/subset.od` – serialized demo project that can be loaded instead of creating one at runtime.

