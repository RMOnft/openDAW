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
