# Oscillators

Band-limited oscillator capable of generating several waveforms.

```ts
import {BandLimitedOscillator, Waveform} from '@opendaw/lib-dsp';

const osc = new BandLimitedOscillator();
osc.generate(buffer, 440 / 48000, Waveform.square, 0, buffer.length);
```

See the [API docs](https://opendaw.org/docs/api/dsp/classes/BandLimitedOscillator.html) for full reference.

