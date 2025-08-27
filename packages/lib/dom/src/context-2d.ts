/**
 * Helpers for working with `CanvasRenderingContext2D`.
 *
 * @example
 * ```ts
 * const ctx = canvas.getContext("2d")!;
 * const result = Context2d.truncateText(ctx, "Hello World", 80);
 * console.log(result.text);
 * ```
 */
import { int } from "@opendaw/lib-std";

const ellipsis = "…";

export namespace Context2d {
  /**
   * Truncates a text so that its rendered width does not exceed the
   * provided `maxWidth`. When truncated an ellipsis character is appended.
   *
   * @param context Canvas 2D context used for measurement
   * @param text Text to measure and possibly truncate
   * @param maxWidth Maximum allowed width in pixels
   * @returns The truncated text and its measured width
   */
  export const truncateText = (
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): {
    text: string;
    width: number;
  } => {
    if (text.length === 0) {
      return { text: "", width: 0 };
    }
    let width: number = context.measureText(text).width;
    if (width <= maxWidth) {
      return { text, width };
    }
    const ellipseWidth = context.measureText(ellipsis).width;
    let l: int = 0 | 0;
    let r: int = text.length | 0;
    while (l < r) {
      const mid: number = (r + l) >>> 1;
      width =
        context.measureText(text.substring(0, mid + 1)).width + ellipseWidth;
      if (width <= maxWidth) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    if (l === 0) {
      return { text: "", width: 0 };
    }
    const result = text.substring(0, l);
    return {
      text: result + ellipsis,
      width: context.measureText(result).width + ellipseWidth,
    };
  };
}
