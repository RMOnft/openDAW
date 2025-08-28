# Input Handling

Utilities for dealing with user input live in `@opendaw/lib-dom`.
They provide typed wrappers around DOM events, keyboard shortcuts and
pointer-based dragging.

```ts
import { Events, Dragging, Keyboard } from "@opendaw/lib-dom";
import { Option } from "@opendaw/lib-std";

Events.subscribe(window, "pointerdown", (ev) => {
  console.log("pointer", ev.clientX, ev.clientY);
});

Dragging.attach(element, (start) =>
  Option.some({
    update: (ev) => console.log(ev.clientX - start.clientX),
  }),
);

window.addEventListener("keydown", (e) => {
  if (Keyboard.GlobalShortcut.isDelete(e)) {
    console.log("delete selection");
  }
});
```

See [`events.ts`](./events.md), [`dragging.ts`](./dragging.md) and
[`keyboard.ts`](./keyboard.md) for detailed documentation of the
individual modules.

