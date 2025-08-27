/**
 * MIDI related box definitions.
 *
 * @packageDocumentation
 */

/** Placeholder MIDI box definition. */
export interface MidiBox {
  /** MIDI channel assigned to the box. */
  channel: number;
}

/** Collection of MIDI box definitions. */
export const midiBoxes: MidiBox[] = [];
