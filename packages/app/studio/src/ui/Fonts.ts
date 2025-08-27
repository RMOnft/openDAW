import {FontFaceProperties} from "@opendaw/lib-dom"

/**
 * Describes the font faces bundled with the application.
 *
 * Each entry is used by {@link FontLoader} to register the fonts with the
 * browser.
 */
export const Fonts = {
    /** Rubik typeface used for headings and UI labels. */
    Rubik: <FontFaceProperties>{
        "font-family": "Rubik",
        "font-weight": 300,
        "font-style": "normal",
        "src": "/fonts/rubik.woff2",
    },
    /** Open Sans typeface used for body text. */
    OpenSans: <FontFaceProperties>{
        "font-family": "Open Sans",
        "font-weight": "normal",
        "font-style": "normal",
        "src": "/fonts/OpenSans-Regular.ttf",
    },
}

