/**
 * Controls playback and timeline navigation.
 *
 * @public
 */
export interface TransportAPI {
  /**
   * Start playback from the current position.
   */
  play(): void;

  /**
   * Pause playback while preserving position.
   */
  pause(): void;

  /**
   * Stop playback and reset the position to the beginning.
   */
  stop(): void;

  /**
   * Move the playhead to a new position.
   * @param seconds - Target position in seconds.
   */
  seek(seconds: number): void;
}
