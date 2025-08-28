# Tempo

openDAW expresses musical time in pulses per quarter note (PPQN). A bar in 4/4 time contains 3,840 pulses, providing a stable grid for sequencing and rendering.

## Conversions

```ts
import {PPQN} from "@opendaw/lib-dsp";

const pulses = PPQN.secondsToPulses(1.5, 120);
const seconds = PPQN.pulsesToSeconds(PPQN.Bar, 90);
```

The timeline renders this grid via `TimeGrid` and `TimeAxis`, while `BPMTools.detect` can estimate the tempo of audio buffers.

