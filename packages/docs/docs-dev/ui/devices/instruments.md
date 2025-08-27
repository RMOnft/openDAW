## Instrument editors

Instrument editors often expose sample selection and parameter knobs. Utilities
such as `SampleSelector` and `ParameterLabelKnob` are reused across many
instruments to provide consistent behaviour and MIDI learn integration.

Like effects, instrument editors are hosted inside `DeviceEditor` so they share
the same header, menu structure and metering.

