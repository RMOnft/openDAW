import {AudioUnitType} from "@opendaw/studio-enums"
import {TrackType} from "@opendaw/studio-adapters"
import {Colors} from "./Colors"

/**
 * Utility helpers for resolving colour tokens based on domain specific enums.
 *
 * These functions keep the mapping of `AudioUnitType` and `TrackType` values to
 * their corresponding design tokens in one place, mirroring the palette defined
 * in `colors.sass`.
 */
export namespace ColorCodes {
    /**
     * Returns a colour token suitable for the given audio unit type.
     */
    export const forAudioType = (type?: AudioUnitType): string => {
        switch (type) {
            case AudioUnitType.Output:
                // Output units are highlighted with blue accents
                return Colors.blue
            case AudioUnitType.Aux:
                // Auxiliary units use the decorative purple accent
                return Colors.purple
            case AudioUnitType.Bus:
                // Busses adopt the secondary orange accent
                return Colors.orange
            case AudioUnitType.Instrument:
                // Instruments are shown with the green success colour
                return Colors.green
            default:
                // Fallback colour for unknown types
                return Colors.dark
        }
    }

    /**
     * Numeric hue value used for track backgrounds based on track type.
     */
    export const forTrackType = (type?: TrackType): number => {
        switch (type) {
            case TrackType.Audio:
                // Audio tracks use a blue-ish hue
                return 200
            case TrackType.Notes:
                // Note tracks have a green-ish hue
                return 45
            case TrackType.Value:
                // Automation/value tracks default to a purple-ish hue
                return 156
            default:
                // No tint for unknown track types
                return 0
        }
    }
}

