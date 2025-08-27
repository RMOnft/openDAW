# MIDI Serialization

The `@opendaw/lib-midi` package encodes and decodes Standard MIDI Files.

```mermaid
graph TD
    File[MIDI File] --> Decoder[MidiFile.decoder]
    Decoder --> Tracks[MidiTrack]
    Tracks --> Events[ControlEvent]
    Tracks --> Encoder[MidiFile.encoder]
    Encoder --> File
```

- See the [package README](../../../lib/midi/README.md) for code samples.
- Return to the [serialization overview](./overview.md).
