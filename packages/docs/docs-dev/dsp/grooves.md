# Grooves

Utilities for warping rhythmic positions using bijective functions.

```ts
import {GroovePattern, QuantisedGrooveFunction} from '@opendaw/lib-dsp';

const func = new QuantisedGrooveFunction(new Float32Array([0, 0.5, 1]));
const groove = new GroovePattern({
  duration: () => 480,
  fx: x => func.fx(x),
  fy: y => func.fy(y)
});

const warped = groove.warp(240);
```

See the [API docs](https://opendaw.org/docs/api/dsp/) for related types.

