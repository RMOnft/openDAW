
import { ValueMapping } from "@opendaw/lib-std";

/**
 * Configuration for snapping elements to the center of the timeline.
 *
 * `snapLength` defines the granularity in pixels while `threshold`
 * specifies how close elements need to be before they snap into place.
 */
export const SnapCenter = {
  snap: { threshold: 0.5, snapLength: 12 },
};

/**
 * Common decibel snapping presets used in the mixer.
 *
 * Values are converted from human‑readable decibels into the internal
 * linear scale via {@link ValueMapping.DefaultDecibel}.
 */
export const SnapCommonDecibel = {
  snap: {
    threshold: [-12, -9, -6, -3].map((y) => ValueMapping.DefaultDecibel.x(y)),
    snapLength: 12,
  },
};
