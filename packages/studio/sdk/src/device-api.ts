/**
 * Public interface implemented by device plugins.
 *
 * The host creates an instance and calls {@link init} before the device
 * participates in the audio graph.
 *
 * @example
 * ```ts
 * class MyDevice implements DeviceApi {
 *   async init(context: unknown) {
 *     // set up resources or parameters here
 *   }
 * }
 * ```
 */
export interface DeviceApi {
  /**
   * Invoked when the plugin is first instantiated by the host.
   */
  init(context: unknown): void | Promise<void>;
}
