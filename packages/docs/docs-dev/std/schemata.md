# Schemata

The `schema.ts` module describes structured data layouts and offers builders
to read and write them.

```ts
import { Schema } from "@opendaw/lib-std/schema";

const builder = Schema.createBuilder({ value: Schema.int8 });
const io = builder();
io.object.value = 7;
```
