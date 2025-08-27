# Bits

`bits.ts` implements a small bitset with convenience methods for querying and
mutating flags.

```ts
import { Bits } from "@opendaw/lib-std/bits";

const bits = new Bits(8);
bits.setBit(2, true);
```
