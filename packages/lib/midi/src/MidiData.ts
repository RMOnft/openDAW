import { byte, Nullable } from "@opendaw/lib-std";

/**
 * Helper functions for working with raw MIDI message bytes.
 */
export namespace MidiData {
  /**
   * High-nibble command values for MIDI status bytes.
   */
  export const enum Command {
    NoteOn = 0x90,
    NoteOff = 0x80,
    PitchBend = 0xe0,
    Controller = 0xb0,
  }

  /** Extract the command nibble from a MIDI message. */
  export const readCommand = (data: Uint8Array) => data[0] & 0xf0;
  /** Extract the channel nibble from a MIDI message. */
  export const readChannel = (data: Uint8Array) => data[0] & 0x0f;
  /** Read first parameter byte if present. */
  export const readParam1 = (data: Uint8Array) =>
    1 < data.length ? data[1] & 0xff : 0;
  /** Read second parameter byte if present. */
  export const readParam2 = (data: Uint8Array) =>
    2 < data.length ? data[2] & 0xff : 0;
  /** Determine whether the message is a note on event. */
  export const isNoteOn = (data: Uint8Array) =>
    MidiData.readCommand(data) === Command.NoteOn;
  /** Read the pitch from a note event. */
  export const readPitch = (data: Uint8Array) => data[1];
  /** Read the velocity from a note-on event and normalize to 0..1. */
  export const readVelocity = (data: Uint8Array) => data[2] / 127.0;
  /** Determine whether the message is a note off event. */
  export const isNoteOff = (data: Uint8Array) =>
    MidiData.readCommand(data) === Command.NoteOff;
  /** Determine whether the message is a pitch bend. */
  export const isPitchWheel = (data: Uint8Array) =>
    MidiData.readCommand(data) === Command.PitchBend;
  /** Convert pitch wheel data to a normalized value in -1..1. */
  export const asPitchBend = (data: Uint8Array) => {
    const p1 = MidiData.readParam1(data) & 0x7f;
    const p2 = MidiData.readParam2(data) & 0x7f;
    const value = p1 | (p2 << 7);
    return 8192 >= value ? value / 8192.0 - 1.0 : (value - 8191) / 8192.0;
  };
  /** Determine whether the message is a controller change. */
  export const isController = (data: Uint8Array): boolean =>
    MidiData.readCommand(data) === Command.Controller;
  /** Convert controller data to a normalized value. */
  export const asValue = (data: Uint8Array) => {
    const value = MidiData.readParam2(data);
    if (64 < value) {
      return 0.5 + (value - 63) / 128;
    } else if (64 > value) {
      return value / 128;
    } else {
      return 0.5;
    }
  };
  /** Create a note on message */
  export const noteOn = (channel: byte, note: byte, velocity: byte) => {
    const bytes = new Uint8Array(3);
    bytes[0] = channel | Command.NoteOn;
    bytes[1] = note | 0;
    bytes[2] = velocity | 0;
    return bytes;
  };
  /** Create a note off message */
  export const noteOff = (channel: byte, note: byte) => {
    const bytes = new Uint8Array(3);
    bytes[0] = channel | Command.NoteOff;
    bytes[1] = note;
    return bytes;
  };

  /** Render a MIDI message as a human readable string. */
  export const debug = (data: Nullable<Uint8Array>): string => {
    if (data === null) {
      return "null";
    }
    if (isNoteOn(data)) {
      return `NoteOn #${readChannel(data)} ${readPitch(data)} : ${readVelocity(data).toFixed(2)}`;
    } else if (isNoteOff(data)) {
      return `NoteOff #${readChannel(data)} ${readPitch(data)}`;
    } else if (isPitchWheel(data)) {
      return `PitchWheel #${readChannel(data)} ${asPitchBend(data)}`;
    } else if (isController(data)) {
      return `Control #${readChannel(data)} ${asValue(data)}`;
    } else {
      return "Unknown";
    }
  };
}
