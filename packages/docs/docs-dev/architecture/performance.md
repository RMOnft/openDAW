# Performance Architecture

openDAW's architecture is designed to keep audio processing responsive while
allowing complex UI interactions. Key aspects include:

- **Thread separation** – real‑time audio code runs inside AudioWorklets and
  Web Workers to avoid blocking the main thread.
- **Deterministic updates** – the [`UpdateClock`](../../studio/core-processors/src/UpdateClock.ts)
  schedules periodic automation events so UI components can sync with the audio
  engine without expensive polling.
- **Streaming metrics** – processors such as
  [`PeakBroadcaster`](../../studio/core-processors/src/PeakBroadcaster.ts) and
  [`SpectrumAnalyser`](../../studio/core-processors/src/SpectrumAnalyser.ts)
  expose lightweight metering data for visualisation.

These conventions minimise garbage collection and cross‑thread latency. For
practical profiling tips see the [performance guide](../performance.md).
