# Plugin Host

OpenDAW's plugin host allows devices written with the SDK to run inside the
application. It manages the lifecycle of plugins and provides access to the
transport, parameter automation and messaging APIs.

## Capabilities

- Loads WebAssembly or JavaScript based processors
- Connects plugin parameters to the automation system
- Exposes audio and MIDI buffers for real‑time processing

## Host environment

Plugins execute in a sandboxed environment and communicate with the host via
a message channel. The host is responsible for instantiating the processor and
supplying state such as the current tempo or sample rate.

For a walk‑through on creating your own plugin, see the
[plugin guide](./plugin-guide.md).
