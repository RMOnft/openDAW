import {AudioUnitType} from "@opendaw/studio-enums"
import {TrackType} from "@opendaw/studio-adapters"
import {Colors} from "./Colors"

/**
 * Helpers for resolving themed colors based on domain types.
 */
export namespace ColorCodes {
    /**
     * Returns a theme color string for the given audio unit type.
     */
    export const forAudioType = (type?: AudioUnitType): string => {
        switch (type) {
            case AudioUnitType.Output:
                return Colors.blue
            case AudioUnitType.Aux:
                return Colors.purple
            case AudioUnitType.Bus:
                return Colors.orange
            case AudioUnitType.Instrument:
                return Colors.green
            default:
                return Colors.dark
        }
    }

    /**
     * Returns a hue value for representing track types.
     */
    export const forTrackType = (type?: TrackType): number => {
        switch (type) {
            case TrackType.Audio:
                return 200
            case TrackType.Notes:
                return 45
            case TrackType.Value:
                return 156
            default:
                return 0
        }
    }
}

