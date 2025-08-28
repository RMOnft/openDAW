/**
 * API for enumerating and selecting audio and MIDI hardware devices.
 *
 * @packageDocumentation
 * @public
 */
export interface DeviceAPI {
  /**
   * Enumerate available input devices.
   *
   * @returns A list of device identifiers suitable for {@link setInput}.
   */
  listInputs(): Promise<string[]>;

  /**
   * Enumerate available output devices.
   *
   * @returns A list of device identifiers suitable for {@link setOutput}.
   */
  listOutputs(): Promise<string[]>;

  /**
   * Select the device that should be used for audio input.
   * @param id - Identifier returned from {@link listInputs}.
   * @returns A promise that resolves once the device is activated.
   */
  setInput(id: string): Promise<void>;

  /**
   * Select the device that should be used for audio output.
   * @param id - Identifier returned from {@link listOutputs}.
   * @returns A promise that resolves once the device is activated.
   */
  setOutput(id: string): Promise<void>;
}
