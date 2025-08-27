# Geometry

Geometry helpers in `geom.ts` provide small functions for working with points
and circles.

```ts
import { Geom, Circle } from "@opendaw/lib-std/geom";

const a: Circle = { x: 0, y: 0, r: 1 };
const b: Circle = { x: 3, y: 0, r: 1 };
Geom.outerTangentPoints(a, b);
```
