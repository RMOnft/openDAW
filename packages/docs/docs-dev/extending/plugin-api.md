# Plugin API

The plugin API is provided by [`@opendaw/sdk`](../package-inventory.md#studio). It exposes
types and utilities for building boxes, parameters and user interfaces that run
inside the Studio.

## Boxes and parameters

Boxes describe the state of a device. Parameters are exposed as fields on a box
and can be automated or modulated by the host.

```ts
import { Box, PrimitiveField, UUID } from "@opendaw/sdk";

class GainBox extends Box {
  protected initializeFields() {
    return { gain: new PrimitiveField("gain", 1.0) };
  }
}
```

## Registering plugins

Plugins are registered by exporting a factory function that stages your box and
optional UI elements.

```ts
import { registerPlugin } from "@opendaw/sdk";

registerPlugin("Gain", (context) => {
  const box = context.graph.stageBox(
    new GainBox({ uuid: UUID.random(), graph: context.graph }),
  );
  return { box };
});
```
