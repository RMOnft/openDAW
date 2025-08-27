## Device UI Module

Components in this folder provide the user interface for editing devices in
openDAW. The module contains:

- **DeviceEditor** – generic wrapper used by individual device editors.
- **DevicePanel** – container that displays the currently selected device
  chain and enables drag‑and‑drop reordering.
- **ParameterLabelKnob**, **SampleSelector** and various helpers used across
  instrument and effect editors.

These pieces work together to offer a consistent experience for all device
types, allowing developers to compose new editors by reusing the building
blocks found here.

