/**
 * Instrument box definitions for musical instruments.
 *
 * @packageDocumentation
 */

/** Placeholder instrument box. */
export interface InstrumentBox {
  /** Human readable name of the instrument. */
  name: string;
}

/** Registered instrument box definitions. */
export const instrumentBoxes: InstrumentBox[] = [];
