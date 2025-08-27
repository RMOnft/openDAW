# Utilities

Miscellaneous helpers for digital signal processing.

## General Helpers

```ts
import {midiToHz, parseTimeSignature} from '@opendaw/lib-dsp';

midiToHz(69); // 440
parseTimeSignature('3/4'); // [3, 4]
```

## RMS

`RMS` tracks the root-mean-square level over a sliding window.

```ts
import {RMS} from '@opendaw/lib-dsp';

const rms = new RMS(128);
rms.pushPop(0.5);
```

## Value

Utilities for working with automation value events.

```ts
import {ValueEvent} from '@opendaw/lib-dsp';

// Iterate events in a window
for (const e of ValueEvent.iterateWindow(events, 0, 960)) {
  console.log(e.value);
}
```

See the [API docs](https://opendaw.org/docs/api/dsp/) for full reference.

