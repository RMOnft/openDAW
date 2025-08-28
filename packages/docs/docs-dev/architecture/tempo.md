# Tempo

openDAW expresses musical time in pulses per quarter note (PPQN). A bar in 4/4
time contains 3 840 pulses, providing a stable grid for sequencing and
rendering.  The PPQN utility collects conversions between pulses, seconds and
samples and provides helpers for formatting musical positions.

## Conversions

```ts
import {PPQN} from "@opendaw/lib-dsp";

const pulses = PPQN.secondsToPulses(1.5, 120);
const seconds = PPQN.pulsesToSeconds(PPQN.Bar, 90);
```

## Tempo Detection

The `BPMTools.detect` function estimates the tempo of PCM buffers.  It is
optimised for typical music ranges and returns a floating‑point BPM value.

```ts
import {BPMTools} from "@opendaw/lib-dsp";

const bpm = BPMTools.detect(buffer, sampleRate);
```

The timeline renders the musical grid via `TimeGrid` and `TimeAxis` and keeps it
in sync with tempo and meter changes.

