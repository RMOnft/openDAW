/**
 * Defines the available content groups inside the browser panel.
 * - `Devices` lists instrument and effect modules.
 * - `Samples` exposes audio files managed by the sampler service.
 */
export enum BrowseScope {
  /** Show device browser */
  Devices,
  /** Show sample browser */
  Samples,
}
