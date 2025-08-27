/**
 * High level access to the audio engine.
 *
 * @public
 */
export interface AudioAPI {
  /**
   * Sample rate of the engine.
   */
  readonly sampleRate: number;

  /**
   * Retrieve a handle to the underlying audio context.
   * @returns Implementation specific audio context object.
   */
  getContext(): unknown;
}
