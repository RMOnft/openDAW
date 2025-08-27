import { int } from "@opendaw/lib-std";
import { MidiTrack } from "./MidiTrack";

/**
 * Description of a decoded MIDI file including its tracks and timing.
 */
export class MidiFileFormat {
  constructor(
    readonly tracks: ReadonlyArray<MidiTrack>,
    readonly formatType: int,
    readonly timeDivision: int,
  ) {}
}
