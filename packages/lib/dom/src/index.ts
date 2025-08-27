/**
 * Entry point for the DOM utilities library. Importing this module exposes
 * a set of helpers for interacting with browser APIs.
 *
 * @example
 * ```ts
 * import {AnimationFrame} from "@opendaw/lib-dom";
 * AnimationFrame.start();
 * ```
 */
const key = Symbol.for("@openDAW/lib-dom");

if ((globalThis as any)[key]) {
  console.debug(
    `%c${key.description}%c is already available in ${globalThis.constructor.name}.`,
    "color: hsl(10, 83%, 60%)",
    "color: inherit",
  );
} else {
  (globalThis as any)[key] = true;
  console.debug(
    `%c${key.description}%c is now available in ${globalThis.constructor.name}.`,
    "color: hsl(200, 83%, 60%)",
    "color: inherit",
  );
}

export * from "./browser";
export * from "./compression";
export * from "./console-commands";
export * from "./constraint";
export * from "./context-2d";
export * from "./css-utils";
export * from "./dragging";
export * from "./events";
export * from "./errors";
export * from "./files";
export * from "./fonts";
export * from "./frames";
export * from "./html";
export * from "./keyboard";
export * from "./modifier-keys";
export * from "./stream";
export * from "./svg";
export * from "./terminable";

