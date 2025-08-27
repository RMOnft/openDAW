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
  /** Determines whether the current host is a localhost instance. */
  export const isLocalHost = () =>
    hasLocation && location.host.includes("localhost");
  /** True when the user agent indicates macOS. */
  export const isMacOS = () =>
    hasNavigator && navigator.userAgent.includes("Mac OS X");
  /** True when the user agent indicates Windows. */
  export const isWindows = () =>
    hasNavigator && navigator.userAgent.includes("Windows");
  /** True when the user agent is Firefox. */
  export const isFirefox = () =>
    hasNavigator && navigator.userAgent.toLowerCase().includes("firefox");
  /** True when running in a web context instead of the Tauri app. */
  export const isWeb = () => !isTauriApp();
  /** Detects vitest environment via `process.env`. */
  export const isVitest =
    typeof process !== "undefined" && process.env?.VITEST === "true";
  /** True when running inside a Tauri application. */
  export const isTauriApp = () => "__TAURI__" in window;
  /** Normalised user agent string or `"N/A"` when unavailable. */
  export const userAgent = hasNavigator
    ? navigator.userAgent
        .replace(/^Mozilla\/[\d.]+\s*/, "")
        .replace(/\bAppleWebKit\/[\d.]+\s*/g, "")
        .replace(/\(KHTML, like Gecko\)\s*/g, "")
        .replace(/\bSafari\/[\d.]+\s*/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "N/A";
}
