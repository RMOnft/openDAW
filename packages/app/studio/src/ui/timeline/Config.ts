import {Padding} from "@opendaw/lib-std"

/** Static configuration values for timeline behaviour. */
export const Config = {
    /** Speed factor for horizontal auto scroll when dragging near edges. */
    AutoScrollHorizontalSpeed: 0.25,
    /** Padding in pixels used for auto scrolling. */
    AutoScrollPadding: [0, 16, 0, 0] satisfies Padding
} as const