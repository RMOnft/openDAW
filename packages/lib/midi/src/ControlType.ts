/**
 * Enumeration of MIDI channel voice message types.
 * The values correspond to the high nibble of a MIDI status byte.
 */
export enum ControlType {
  /** Note on message */
  NOTE_ON = 0x90,
  /** Note off message */
  NOTE_OFF = 0x80,
  /** Polyphonic after touch */
  NOTE_AFTER_TOUCH = 0xa0,
  /** Continuous controller change */
  CONTROLLER = 0xb0,
  /** Program change */
  PROGRAM_CHANGE = 0xc0,
  /** Channel after touch */
  CHANNEL_AFTER_TOUCH = 0xd0,
  /** Pitch bend */
  PITCH_BEND = 0xe0,
}
