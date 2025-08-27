_This package is part of the openDAW SDK_

# @opendaw/lib-midi

Utilities for reading, writing and interpreting MIDI data.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/midi/) for detailed reference.

See the [serialization guide](../../docs/docs-dev/serialization/midi.md) for
an overview of how MIDI structures map onto binary files and other formats.

## Decoding a MIDI file

```ts
import { MidiFile } from "@opendaw/lib-midi";

// Fetch a MIDI file from the network
const response = await fetch("song.mid");
const buffer = await response.arrayBuffer();
// Decode the file into a format object
const midi = MidiFile.decoder(buffer).decode();
// Inspect the number of tracks
console.log(midi.tracks.length);
```

### Other decoding scenarios

- Reading from the filesystem using Node.js buffers
- Inspecting meta-events such as tempo or time signatures
- Filtering channel events before rendering

## Encoding a MIDI file

```ts
import {
  MidiFile,
  MidiTrack,
  ControlEvent,
  ControlType,
} from "@opendaw/lib-midi";

// Create a track and populate it with two note events
const track = MidiTrack.createEmpty();
track.controlEvents.add(0, new ControlEvent(0, ControlType.NOTE_ON, 60, 127));
track.controlEvents.add(0, new ControlEvent(480, ControlType.NOTE_OFF, 60, 0));

// Encode the track into a MIDI file buffer
const output = MidiFile.encoder().addTrack(track).encode();
// Write output.toUint8Array() to disk
```

## Integrating with DSP

```ts
import { MidiData } from "@opendaw/lib-midi";
import { BandLimitedOscillator, Waveform } from "@opendaw/lib-dsp";

// Synthesize a note when a MIDI message is received
const message = MidiData.noteOn(0, 69, 100);
if (MidiData.isNoteOn(message)) {
  const freq = 440 * Math.pow(2, (MidiData.readPitch(message) - 69) / 12);
  const osc = new BandLimitedOscillator();
  const buffer = new Float32Array(128);
  osc.generate(buffer, freq / 44100, Waveform.sine, 0, buffer.length);
}
```

## Documentation

- [Package overview](../../docs/docs-dev/midi/overview.md)
- [Event types](../../docs/docs-dev/midi/events.md)
- [File format](../../docs/docs-dev/midi/format.md)
- [Usage examples](../../docs/docs-dev/midi/examples.md)
- [Serialization mapping](../../docs/docs-dev/serialization/midi.md)
- [Project-wide overview](../../docs/docs-dev/serialization/overview.md)

## Test fixtures

Sample MIDI and DAW project files can be found in [`test-files`](../../test-files). See the
[test file overview](../../docs/docs-dev/testing/test-files.md) for details on available fixtures.
