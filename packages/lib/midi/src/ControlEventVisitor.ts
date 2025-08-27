import { byte } from "@opendaw/lib-std";

/**
 * Visitor interface for handling decoded {@link ControlEvent} instances.
 */
export interface ControlEventVisitor {
  /** Called for a note on message */
  noteOn?(note: byte, velocity: number): void;
  /** Called for a note off message */
  noteOff?(note: byte): void;
  /** Called for pitch bend messages with value in -1..1 */
  pitchBend?(delta: number): void;
  /** Called for controller changes with normalized value */
  controller?(id: byte, value: number): void;
}
