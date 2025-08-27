/**
 * Provides offline rendering capabilities for producing audio output
 * independent of real time.
 *
 * @public
 */
export interface RenderAPI {
  /**
   * Render a section of the current project.
   *
   * @param start - Start time in seconds.
   * @param end - End time in seconds.
   * @returns A promise resolving to an ArrayBuffer containing the encoded audio.
   */
  render(start: number, end: number): Promise<ArrayBuffer>;
}
