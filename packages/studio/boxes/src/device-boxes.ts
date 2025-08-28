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

/**
 * Registry of all available device boxes. Plugins may append to this list
 * during initialization to expose new device types to the host.
 */
export const deviceBoxes: DeviceBox[] = [];
