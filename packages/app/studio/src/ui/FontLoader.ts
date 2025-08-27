import {Fonts} from "@/ui/Fonts"
import {loadFont} from "@opendaw/lib-dom"
import {Lazy} from "@opendaw/lib-std"

/**
 * Loads the font faces used by the studio UI.
 *
 * Fonts are declared in {@link Fonts} and fetched only once on first access.
 */
export class FontLoader {
    /**
     * Trigger loading for all fonts used by the application.
     *
     * The result resolves when all `FontFace` objects have either loaded or
     * failed, mirroring the behaviour of `Promise.allSettled`.
     */
    @Lazy
    static async load() {
        return Promise.allSettled([
            loadFont(Fonts.Rubik),
            loadFont(Fonts.OpenSans),
        ])
    }
}