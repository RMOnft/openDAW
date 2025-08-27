# Events

Utilities for dealing with DOM events live in `events.ts`. They provide
strongly typed wrappers around common event patterns.

```ts
import { Events } from "@opendaw/lib-dom";
const sub = Events.subscribe(window, "resize", () => console.log("resized"));
// later
sub.terminate();
```

The module also contains helpers for pointer capturing and text-input
checks that are used by higher level features such as dragging and
keyboard shortcuts. Double pointer downs can be handled with
`subscribeDblDwn`:

```ts
Events.subscribeDblDwn(canvas, e => console.log("double down", e.pointerId));
```

