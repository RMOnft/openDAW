/**
 * Audio file and stream box definitions.
 *
 * @packageDocumentation
 */

/** Placeholder audio box definition. */
export interface AudioBox {
  /** Source file name or identifier. */
  source: string;
}

/** Registered audio box definitions. */
export const audioBoxes: AudioBox[] = [];
