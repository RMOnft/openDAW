// Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)
import { isUndefined, Nullish } from "@opendaw/lib-std";

/**
 * Helpers for resolving `ConstrainDOMString` values.
 *
 * These utilities are useful when dealing with APIs such as
 * `MediaTrackConstraints` which allow a variety of constraint shapes.
 */
export namespace ConstrainDOM {
  /**
   * Resolves a [`ConstrainDOMString`](https://developer.mozilla.org/en-US/docs/Web/API/ConstrainDOMString)
   * to a comma separated string or `undefined`.
   *
   * @example
   * ```ts
   * const constraint: ConstrainDOMString = ["video", "audio"];
   * const value = ConstrainDOM.resolveString(constraint);
   * // value === "video,audio"
   * ```
   *
   * @param constrain Constraint value to resolve.
   * @returns Comma separated string representation or `undefined`.
   */
  export const resolveString = (
    constrain: Nullish<ConstrainDOMString>,
  ): Nullish<string> => {
    if (isUndefined(constrain)) {
      return undefined;
    }
    if (typeof constrain === "string") {
      return constrain;
    }
    if (Array.isArray(constrain)) {
      return constrain.join(",");
    }
    if (typeof constrain === "object") {
      if (typeof constrain.exact === "string") {
        return constrain.exact;
      }
      if (Array.isArray(constrain.exact)) {
        return constrain.exact.join(",");
      }
      if (typeof constrain.ideal === "string") {
        return constrain.ideal;
      }
      if (Array.isArray(constrain.ideal)) {
        return constrain.ideal.join(",");
      }
    }
    return undefined;
  };
}
