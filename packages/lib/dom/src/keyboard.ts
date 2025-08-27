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
  /** Returns whether the platform specific control key is pressed. */
  export const isControlKey = ({
    ctrlKey,
    metaKey,
  }: {
    ctrlKey: boolean;
    metaKey: boolean;
  }) => (Browser.isMacOS() ? metaKey : ctrlKey);

  /** Indicates if the copy/alternate key (Alt) is active. */
  export const isCopyKey = ({ altKey }: { altKey: boolean }) => altKey;

  /** Collection of global shortcut helpers. */
  export const GlobalShortcut = Object.freeze({
    /** Delete or Backspace outside text inputs. */
    isDelete: (event: KeyboardEvent) =>
      !Events.isTextInput(event.target) &&
      (event.code === "Delete" || event.code === "Backspace"),
    /** Cmd/Ctrl+A without Shift: select all. */
    isSelectAll: (event: KeyboardEvent) =>
      isControlKey(event) && !event.shiftKey && event.code === "KeyA",
    /** Cmd/Ctrl+Shift+A: deselect all. */
    isDeselectAll: (event: KeyboardEvent) =>
      isControlKey(event) && event.shiftKey && event.code === "KeyA",
  });
}
