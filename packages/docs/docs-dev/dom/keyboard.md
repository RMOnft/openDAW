# Keyboard

Keyboard related helpers live in `keyboard.ts` and `modifier-keys.ts`.
They normalise platform specific modifier keys and expose common shortcut
checks.

```ts
import { Keyboard, ModfierKeys } from "@opendaw/lib-dom";

window.addEventListener("keydown", (e) => {
  if (Keyboard.GlobalShortcut.isDelete(e)) {
    console.log("remove selection", ModfierKeys.System.Cmd);
  }
});
```
