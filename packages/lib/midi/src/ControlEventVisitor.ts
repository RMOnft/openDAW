import { byte } from "@opendaw/lib-std";

/**
 * Visitor interface for handling decoded {@link ControlEvent} instances.
 */
export interface ControlEventVisitor {
  /**
   * Called for a note on message.
   *
   * @param note - MIDI pitch value
   * @param velocity - normalized velocity 0..1
   */
  noteOn?(note: byte, velocity: number): void;
  /**
   * Called for a note off message.
   *
   * @param note - MIDI pitch value
   */
  noteOff?(note: byte): void;
  /**
   * Called for pitch bend messages.
   *
   * @param delta - bend amount in the range -1..1
   */
  pitchBend?(delta: number): void;
  /**
   * Called for controller changes.
   *
   * @param id - controller number
   * @param value - normalized controller value
   */
  controller?(id: byte, value: number): void;
}
