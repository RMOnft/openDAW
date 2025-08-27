# Fonts

Utilities for loading fonts live in `fonts.ts`.

```ts
import { loadFont } from "@opendaw/lib-dom";
await loadFont({
  "font-family": "Demo",
  "font-style": "normal",
  "font-weight": "normal",
  src: "/fonts/demo.woff2"
});
```

