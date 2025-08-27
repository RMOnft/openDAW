# Delay

Implements a basic delay line with feedback and wet/dry mix.

```ts
import {Delay} from '@opendaw/lib-dsp';

const delay = new Delay(48000, 64);
delay.offset = 12000;
delay.process(input, output, 0, input.length);
```

See the [API docs](https://opendaw.org/docs/api/dsp/classes/Delay.html) for full reference.

