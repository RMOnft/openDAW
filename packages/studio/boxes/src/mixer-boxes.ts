/**
 * Mixer and routing box definitions.
 *
 * @packageDocumentation
 */

/** Placeholder mixer box definition. */
export interface MixerBox {
  /** Name of the mixer channel. */
  channel: string;
}

/** Registered mixer box definitions. */
export const mixerBoxes: MixerBox[] = [];
