# Devices and Plugins

Add instruments and effects to shape your sound.

## Built-in instruments

1. In a track's device chain, click the **+** button and choose a built-in instrument such as a synth or sampler.
2. The instrument appears at the start of the chain. Use its panel to tweak parameters; drag knobs, enter values, or right-click for options like reset and automation.

## Built-in effects

1. Add effects by clicking **+** after an existing device and selecting from built-in modules like EQ, delay, or reverb.
2. Devices process from top to bottom. Drag to reorder, and adjust each effect's parameters in its panel.
3. Hover a device to bypass or remove it from the chain.

## Third-party plugins

OpenDAW loads plugins built with the project's SDK or other compatible Web Audio formats.

- Ensure plugins match your platform (e.g., 64-bit) and are officially supported.
- Traditional desktop formats like VST or Audio Unit may require additional support and are not guaranteed to work.
- Different plugins may expose unique parameters; test them in your environment to confirm full compatibility.

Interested in building your own plugins? Check out the [plugin guide](../../docs-dev/extending/plugin-guide.md) in the developer documentation.

For how device controls are connected to automation, see the [parameter adapter guide](../../docs-dev/extending/parameter-adapters.md).

## Modular workflow

Devices can be arranged as modules on a canvas and linked with wires for
custom signal chains. Learn more in the [modular UI overview](../../docs-dev/ui/modular/overview.md).

## Mapping parameters

- Right-click a control to create automation or modulation targets.
- Parameters can be adjusted in real time and recorded during playback.

## Developer docs

Learn more about how openDAW interfaces with hardware and exports audio:

- [Audio and MIDI overview](../../docs-dev/audio-midi/overview.md)
- [Audio devices](../../docs-dev/audio-midi/audio-devices.md)
- [MIDI devices](../../docs-dev/audio-midi/midi-devices.md)
- [Offline rendering](../../docs-dev/audio-midi/offline-rendering.md)
- [Audio effects](../../docs-dev/dsp/devices/audio-effects.md)
- [MIDI effects](../../docs-dev/dsp/devices/midi-effects.md)
- [Instruments](../../docs-dev/dsp/devices/instruments.md)
