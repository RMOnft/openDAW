/**
 * Keyboard related utilities including modifier key detection and common
 * shortcuts.
 *
 * @example
 * ```ts
 * import {Keyboard} from "@opendaw/lib-dom";
 * window.addEventListener("keydown", e => {
 *   if (Keyboard.GlobalShortcut.isSelectAll(e)) {
 *     console.log("select all");
 *   }
 * });
 * ```
 */
import { Browser } from "./browser";
import { Events } from "./events";

export namespace Keyboard {
  /**
   * Returns whether the platform specific control key is pressed.
   *
   * @param param0 Keyboard modifier flags from a `KeyboardEvent`.
   * @returns `true` when the macOS "meta" key or the Windows/Linux "ctrl"
   * key is held down.
   */
  export const isControlKey = ({
    ctrlKey,
    metaKey,
  }: {
    ctrlKey: boolean;
    metaKey: boolean;
  }): boolean => (Browser.isMacOS() ? metaKey : ctrlKey);

  /**
   * Indicates if the copy/alternate key (Alt) is active.
   *
   * @param param0 Modifier flag from a `KeyboardEvent`.
   * @returns `true` when the Alt key is pressed.
   */
  export const isCopyKey = ({ altKey }: { altKey: boolean }): boolean => altKey;

  /** Collection of global shortcut helpers. */
  export const GlobalShortcut = Object.freeze({
    /**
     * Delete or Backspace outside text inputs.
     *
     * @param event Keyboard event to inspect.
     * @returns `true` when a deletion shortcut was triggered.
     */
    isDelete: (event: KeyboardEvent): boolean =>
      !Events.isTextInput(event.target) &&
      (event.code === "Delete" || event.code === "Backspace"),
    /**
     * Cmd/Ctrl+A without Shift: select all.
     *
     * @param event Keyboard event to inspect.
     * @returns `true` when a select-all shortcut was triggered.
     */
    isSelectAll: (event: KeyboardEvent): boolean =>
      isControlKey(event) && !event.shiftKey && event.code === "KeyA",
    /**
     * Cmd/Ctrl+Shift+A: deselect all.
     *
     * @param event Keyboard event to inspect.
     * @returns `true` when a deselect-all shortcut was triggered.
     */
    isDeselectAll: (event: KeyboardEvent): boolean =>
      isControlKey(event) && event.shiftKey && event.code === "KeyA",
  });
}
