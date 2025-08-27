---
title: Font Loading
---

Fonts are defined in [`src/ui/Fonts.ts`](../../../../../app/studio/src/ui/Fonts.ts)
and loaded on demand through [`FontLoader`](../../../../../app/studio/src/ui/FontLoader.ts).

`FontLoader.load()` lazily registers both the Rubik and Open Sans typefaces
using the `FontFace` API. The operation returns a `Promise.allSettled` result so
the application can continue even if a font fails to load.

