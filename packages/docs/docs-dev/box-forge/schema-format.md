# Schema Format

Schemas describe boxes using plain objects. Each box lists its fields and optional
pointer rules:

```ts
import { BoxSchema } from "@opendaw/lib-box-forge";

const DrumBox: BoxSchema<PointerType> = {
  type: "box",
  class: {
    name: "DrumBox",
    fields: {
      1: { type: "float32", name: "gain" },
      2: {
        type: "pointer",
        name: "output",
        pointerType: PointerType.AudioOutput,
        mandatory: true,
      },
    },
  },
};
```
