# Plugin Guide

Use the openDAW SDK to build UI plugins that run inside
[`@opendaw/app-studio`](../package-inventory.md#app).
Start with the [openDAW SDK](./opendaw-sdk.md) and stage a box that exposes
parameters and controls.

```mermaid
flowchart LR
  A[Plugin UI] --> B[@opendaw/app-studio]
  B --> C[Audio Graph]
```

1. Create a new project and install `@opendaw/sdk`.
2. Implement a box with parameters that drive your UI.
3. Register the plugin so the Studio can load it.

For DSP customization see the [Processor guide](./processor-guide.md).
