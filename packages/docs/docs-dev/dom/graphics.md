# Graphics

The graphics oriented helpers include `context-2d.ts` for canvas text
measurement and `svg.ts` for constructing path strings.

```ts
import { Context2d, Svg } from "@opendaw/lib-dom";

const ctx = canvas.getContext("2d")!;
const { text } = Context2d.truncateText(ctx, "Hello", 50);

const path = Svg.pathBuilder().moveTo(0, 0).lineTo(10, 10).close().get();
```
