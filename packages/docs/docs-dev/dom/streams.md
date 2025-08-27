# Streams

The `stream.ts` module exposes helpers for consuming Web streams. Currently
it provides a single `read` function that collects a `ReadableStream` into
an `ArrayBuffer`.

```ts
import { Stream } from "@opendaw/lib-dom";
const reader = response.body!.getReader();
const buffer = await Stream.read(reader);
```

This is useful when working with fetch responses or other streaming APIs
that deliver binary data.
