import { int } from "@opendaw/lib-std";
import { MidiTrack } from "./MidiTrack";

/**
 * Description of a decoded MIDI file including its tracks and timing.
 */
export class MidiFileFormat {
  constructor(
    /** Array of decoded tracks */
    readonly tracks: ReadonlyArray<MidiTrack>,
    /** MIDI file format type (0,1,2) */
    readonly formatType: int,
    /** Ticks per quarter note or SMPTE division */
    readonly timeDivision: int,
  ) {}
}
