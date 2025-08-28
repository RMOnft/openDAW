/**
 * Runtime environment and user agent detection helpers.
 *
 * Provides simple functions that query the global `window` and
 * `navigator` objects to identify the current platform.
 *
 * @example
 * ```ts
 * import { Browser } from "@opendaw/lib-dom";
 *
 * if (Browser.isMacOS()) {
 *   // Enable macOS specific shortcuts
 * }
 * ```
 */
// noinspection PlatformDetectionJS
// Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)

export namespace Browser {
  const hasLocation =
      typeof self !== "undefined" &&
      "location" in self &&
      typeof self.location !== "undefined";
  const hasNavigator =
      typeof self !== "undefined" &&
      "navigator" in self &&
      typeof self.navigator !== "undefined";
  /**
   * Determines whether the current host is a localhost instance.
   *
   * @returns `true` when `location.host` contains `"localhost"`.
   */
  export const isLocalHost = (): boolean =>
    hasLocation && location.host.includes("localhost");
  /**
   * Checks whether the user agent indicates macOS.
   *
   * @returns `true` for macOS platforms.
   */
  export const isMacOS = (): boolean =>
    hasNavigator && navigator.userAgent.includes("Mac OS X");
  /**
   * Checks whether the user agent indicates Windows.
   *
   * @returns `true` for Windows platforms.
   */
  export const isWindows = (): boolean =>
    hasNavigator && navigator.userAgent.includes("Windows");
  /**
   * Checks whether the user agent is Firefox.
   *
   * @returns `true` when the browser is Firefox.
   */
  export const isFirefox = (): boolean =>
    hasNavigator && navigator.userAgent.toLowerCase().includes("firefox");
  /**
   * Checks whether openDAW runs inside a regular web page instead of the
   * Tauri desktop application.
   *
   * @returns `true` for web contexts.
   */
  export const isWeb = (): boolean => !isTauriApp();
  /**
   * Detects whether the environment is a Vitest test run via `process.env`.
   *
   * @returns `true` when executing inside Vitest.
   */
  export const isVitest =
    typeof process !== "undefined" && process.env?.VITEST === "true";
  /**
   * Checks whether the code runs inside a Tauri application.
   *
   * @returns `true` when the `__TAURI__` object is present.
   */
  export const isTauriApp = (): boolean => "__TAURI__" in window;
  /**
   * Normalised user agent string or `"N/A"` when unavailable.
   *
   * @returns User agent description without redundant tokens.
   */
  export const userAgent: string = hasNavigator
    ? navigator.userAgent
        .replace(/^Mozilla\/[\d.]+\s*/, "")
        .replace(/\bAppleWebKit\/[\d.]+\s*/g, "")
        .replace(/\(KHTML, like Gecko\)\s*/g, "")
        .replace(/\bSafari\/[\d.]+\s*/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "N/A";
}
