/**
 * Collection of snapping presets used by timeline and meter widgets.
 */
import {ValueMapping} from "@opendaw/lib-std"

/** Snap settings that align selections around the center. */
export const SnapCenter = {snap: {threshold: 0.5, snapLength: 12}}

/**
 * Snap settings based on common decibel values. Useful for placing
 * automation points at musically meaningful levels.
 */
export const SnapCommonDecibel = {
    snap: {
        threshold: [-12, -9, -6, -3]
            .map(y => ValueMapping.DefaultDecibel.x(y)), snapLength: 12
    }
}
