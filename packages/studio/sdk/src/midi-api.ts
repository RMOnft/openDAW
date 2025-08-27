/**
 * Interfaces with MIDI hardware and virtual devices.
 *
 * @public
 */
export interface MidiAPI {
  /**
   * Send a MIDI message immediately.
   * @param data - Raw MIDI bytes.
   */
  send(data: Uint8Array): void;

  /**
   * Register a callback for incoming MIDI messages.
   * @param handler - Function invoked with the received data.
   */
  onMessage(handler: (data: Uint8Array) => void): void;
}
