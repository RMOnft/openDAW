# Plugin examples

These snippets illustrate typical plugin setups using the SDK.

## Simple gain control

```ts
import { registerPlugin, Box, PrimitiveField, UUID } from "@opendaw/sdk";

class GainBox extends Box {
  protected initializeFields() {
    return { gain: new PrimitiveField("gain", 1.0) };
  }
}

registerPlugin("Gain", (ctx) => {
  const box = ctx.graph.stageBox(
    new GainBox({ uuid: UUID.random(), graph: ctx.graph }),
  );
  return { box };
});
```

## MIDI controlled parameter

```ts
import { AutomatableParameterFieldAdapter } from "@opendaw/studio-adapters";

const adapter = new AutomatableParameterFieldAdapter(
  ctx,
  field,
  ValueMapping.linear(0, 1),
  StringMapping.unitInterval,
  "Gain",
);
adapter.registerMidiControl();
```
