# openDAW SDK

The openDAW SDK enables developers to extend the workstation with custom devices, user interfaces, and tools. This guide covers installation, the device/box lifecycle, and the public extension points exposed by the platform.

## Installation

1. Install [Node.js](https://nodejs.org/) 18 or newer and npm.
2. Create a new project or move into an existing one.
3. Add the SDK to your project:

```bash
npm install @opendaw/sdk
```

TypeScript types are bundled with the package, so no additional installs are required.

## Quick start

The snippet below creates a simple gain device. It exposes a single parameter and processes incoming audio samples:

```ts
import { Box, BoxGraph, PrimitiveField, UUID } from "@opendaw/sdk";

class GainBox extends Box {
  protected initializeFields() {
    return {
      gain: new PrimitiveField("gain", 1.0),
    };
  }

  process(input: Float32Array, output: Float32Array) {
    const g = this.getField("gain").value;
    for (let i = 0; i < input.length; i++) {
      output[i] = input[i] * g;
    }
  }
}

const graph = new BoxGraph();
const gain = graph.stageBox(
  new GainBox({ uuid: UUID.random(), graph, name: "Gain" }),
);
```

## Device and Box lifecycle

1. **Creation** – Use `BoxGraph` to stage new boxes. Each box is assigned a UUID and added inside a transaction.
2. **Initialization** – `initializeFields` defines the parameters and connections for the box.
3. **Execution** – Boxes receive data and update their fields. Parameters can be automated or manipulated in real time.
4. **Deletion** – Call `delete()` or `unstage()` to remove a box and release its resources.

## Parameters and UI

Parameters are represented as fields on a box. Primitive fields hold numbers, booleans, or strings. Pointer fields connect boxes together. The SDK ships with UI helpers so a device can expose controls such as knobs or sliders that bind to those fields. Custom UI components can be built with any framework and communicate through the same field API.

## Public extension points

The following APIs are stable and intended for third‑party development:

- **Boxes** – Extend the `Box` base class to implement new audio or utility devices.
- **Parameters** – Define new field types or automation behaviors to expose device controls.
- **Device UI** – Create custom visual components and adapters that bind to box fields.
- **Graph listeners** – Subscribe to `BoxGraph` updates to track creation, deletion, or parameter changes.
- **Project tooling** – Use the SDK's serialization helpers to read and write project data for import/export tools.

These entry points provide flexibility for building plugins, tools, or entire workflows on top of openDAW.
