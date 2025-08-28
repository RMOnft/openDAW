// Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)

/**
 * Properties required to load a custom font.
 */
export type FontFaceProperties = {
  /** Name used to reference the font in CSS. */
  "font-family": string;
  /** Font style variant. */
  "font-style": "normal" | "italic" | "oblique";
  /**
   * Weight numeric value or keyword accepted by the `FontFace` constructor.
   */
  "font-weight":
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 1000
    | "normal"
    | "bold"
    | "bolder"
    | "lighter";
  /** URL pointing to the font resource. */
  src: string;
};

/**
 * Loads a font via the `FontFace` API and registers it with the document.
 *
 * @example
 * ```ts
 * await loadFont({
 *   "font-family": "MyFont",
 *   "font-style": "normal",
 *   "font-weight": "normal",
 *   src: "/fonts/my-font.woff2"
 * });
 * document.body.style.fontFamily = "MyFont";
 * ```
 *
 * @param properties Font description and source URL.
 * @returns Promise resolving once the font is loaded and registered.
 */
export const loadFont = async (properties: FontFaceProperties): Promise<void> => {
  try {
    const response = await fetch(properties.src, { credentials: "omit" });
    const fontData = await response.arrayBuffer();
    const fontFace = new FontFace(properties["font-family"], fontData, {
      display: "block",
      weight: String(properties["font-weight"]),
      style: properties["font-style"],
    });
    await fontFace.load();
    document.fonts.add(fontFace);
    console.debug(`font-family: '${fontFace.family}'`);
  } catch (error) {
    console.error(error);
  }
};

