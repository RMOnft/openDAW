# Core Processors

This package contains the Web Audio `AudioWorkletProcessor` implementations that power the OpenDAW engine.

## Processing flow

```mermaid
flowchart LR
    NoteEventSource -->|notes| NoteEventInstrument --> InstrumentProcessor
    InstrumentProcessor --> ChannelStripProcessor --> Mixer
    ChannelStripProcessor -->|aux| AuxSendProcessor
    ChannelStripProcessor -->|peaks| PeakBroadcaster
    ChannelStripProcessor -->|spectrum| SpectrumAnalyser
```

The diagram illustrates how note events are transformed into audio, mixed, and analysed within the engine.

## Device processors

Further details on built-in devices are available in the developer documentation:

- [Audio effects](../../docs/docs-dev/dsp/devices/audio-effects.md)
- [MIDI effects](../../docs/docs-dev/dsp/devices/midi-effects.md)
- [Instruments](../../docs/docs-dev/dsp/devices/instruments.md)

## Test fixtures

Processor behaviour can be verified with the example projects in [`test-files`](../../../test-files).
Additional details are documented in the [developer testing guide](../../docs/docs-dev/testing/test-files.md).
