// Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)

/**
 * Properties required to load a custom font.
 */
export type FontFaceProperties = {
  "font-family": string;
  "font-style": "normal" | "italic" | "oblique";
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
 */
export const loadFont = async (properties: FontFaceProperties) => {
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

