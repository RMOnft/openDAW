# MIDI Examples

```ts
import { MidiFile } from "@opendaw/lib-midi";

// Decode a file
const format = MidiFile.decoder(buffer).decode();

// Encode a new file from existing tracks
const bytes = MidiFile.encoder().addTrack(format.tracks[0]).encode();
```
