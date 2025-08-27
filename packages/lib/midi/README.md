_This package is part of the openDAW SDK_

# @opendaw/lib-midi

Utilities for reading, writing and interpreting MIDI data.

## Decoding a MIDI file

```ts
import { MidiFile } from "@opendaw/lib-midi";

const response = await fetch("song.mid");
const buffer = await response.arrayBuffer();
const midi = MidiFile.decoder(buffer).decode();
console.log(midi.tracks.length);
```

## Encoding a MIDI file

```ts
import {
  MidiFile,
  MidiTrack,
  ControlEvent,
  ControlType,
} from "@opendaw/lib-midi";

const track = MidiTrack.createEmpty();
track.controlEvents.add(0, new ControlEvent(0, ControlType.NOTE_ON, 60, 127));
track.controlEvents.add(0, new ControlEvent(480, ControlType.NOTE_OFF, 60, 0));

const output = MidiFile.encoder().addTrack(track).encode();
// write output.toUint8Array() to disk
```

## Integrating with DSP

```ts
import { MidiData } from "@opendaw/lib-midi";
import { BandLimitedOscillator, Waveform } from "@opendaw/lib-dsp";

const message = MidiData.noteOn(0, 69, 100);
if (MidiData.isNoteOn(message)) {
  const freq = 440 * Math.pow(2, (MidiData.readPitch(message) - 69) / 12);
  const osc = new BandLimitedOscillator();
  const buffer = new Float32Array(128);
  osc.generate(buffer, freq / 44100, Waveform.sine, 0, buffer.length);
}
```

## Test fixtures

Sample MIDI and DAW project files can be found in [`test-files`](../../test-files). See the
[test file overview](../../docs/docs-dev/testing/test-files.md) for details on available fixtures.
