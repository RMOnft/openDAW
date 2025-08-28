/**
 * High level abstraction for interacting with connected audio and MIDI
 * hardware.
 *
 * @packageDocumentation
 */

/**
 * Interacts with input and output devices such as audio interfaces or MIDI
 * controllers.
 *
 * @public
 */
export interface DeviceAPI {
  /**
   * Enumerate available input devices.
   */
  listInputs(): Promise<string[]>;

  /**
   * Enumerate available output devices.
   */
  listOutputs(): Promise<string[]>;

  /**
   * Select the device that should be used for audio input.
   * @param id - Identifier returned from {@link listInputs}.
   */
  setInput(id: string): Promise<void>;

  /**
   * Select the device that should be used for audio output.
   * @param id - Identifier returned from {@link listOutputs}.
   */
  setOutput(id: string): Promise<void>;
}
