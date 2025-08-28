import { Browser } from "./browser";

/**
 * Mapping of modifier key labels for macOS and Windows platforms.
 *
 * The exported object contains three properties:
 *
 * - `Mac`: Symbols used on macOS keyboards.
 * - `Win`: Labels used on Windows keyboards.
 * - `System`: The set matching the current platform as detected by
 *   {@link Browser.isMacOS}.
 */
export const ModfierKeys = (() => {
  const Mac = { Cmd: "⌘", Opt: "⌥", Shift: "⇧" };
  const Win = { Cmd: "Ctrl", Opt: "Alt", Shift: "⇧" };
  return Object.freeze({ Mac, Win, System: Browser.isMacOS() ? Mac : Win });
})();
