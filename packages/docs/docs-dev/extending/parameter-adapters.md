# Parameter adapters

Parameter adapters bridge primitive fields from boxes to the automation and
modulation system. Each adapter wraps a field and exposes it as a parameter with
value mapping, string formatting and control source subscriptions.

## Creating parameters

Adapters are collected in a `ParameterAdapterSet`. Modules and other boxes use
this set to register their controls:

```ts
const params = new ParameterAdapterSet(ctx)
params.createParameter(
  box.gain,
  ValueMapping.DefaultDecibel,
  StringMapping.numeric({ unit: "db" }),
  "Gain"
)
```

The returned `AutomatableParameterFieldAdapter` handles automation playback and
can listen for MIDI or modulation sources.

## Lookup and registration

Every adapter registers itself with `ParameterFieldAdapters`, allowing other
components to look up parameters by their `Address`. This enables UI elements to
resolve the correct parameter even when modules are dynamically created.

Further reading:

- [`AutomatableParameterFieldAdapter`](../../../studio/adapters/src/AutomatableParameterFieldAdapter.ts)
- [`ParameterAdapterSet`](../../../studio/adapters/src/ParameterAdapterSet.ts)
- [`ParameterFieldAdapters`](../../../studio/adapters/src/ParameterFieldAdapters.ts)
