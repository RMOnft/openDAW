# Device Boxes

Device boxes describe the state and parameters of instruments, effects and other
processors. Each box is wrapped by a matching adapter that maps fields to
TypeScript APIs and audio worklet processors.

## Creating a device box

1. Define a box schema with fields for parameters and routing.
2. Implement a DeviceBoxAdapter that wraps the box and exposes parameters with
   `ParameterAdapterSet`.
3. Register the adapter so the Studio can instantiate your device.

Existing adapters in `@opendaw/studio-adapters` provide concrete examples for
both instruments and effects.
