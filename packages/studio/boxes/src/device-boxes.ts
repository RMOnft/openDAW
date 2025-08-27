/**
 * Definitions for device related boxes used by the studio.
 *
 * @packageDocumentation
 */

/** Placeholder interface representing a generic device box. */
export interface DeviceBox {
  /** Unique device identifier. */
  id: string;
}

/** Collection of registered device boxes. */
export const deviceBoxes: DeviceBox[] = [];
