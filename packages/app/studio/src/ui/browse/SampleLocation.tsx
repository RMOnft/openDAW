/**
 * Indicates where a sample originates from.
 *
 * Used by {@link SampleBrowser} to toggle between cloud and OPFS backed
 * libraries.
 */
export const enum SampleLocation {
  /** Sample hosted on the server */
  Cloud,
  /** Sample stored locally in the browser */
  Local,
}
