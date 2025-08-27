# Compression

`compression.ts` provides thin wrappers around the `CompressionStream` and
`DecompressionStream` browser APIs.

```ts
import { Compression } from "@opendaw/lib-dom";
const buffer = new TextEncoder().encode("hello").buffer;
const zipped = await Compression.encode(buffer);
const restored = await Compression.decode(zipped);
```

