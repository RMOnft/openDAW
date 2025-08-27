import {createElement} from "@opendaw/lib-jsx"

/** Props for {@link FlexSpacer}. */
export interface FlexSpacerProps {
    /** Fixed width in pixels when provided. */
    pixels?: number
}

/** Flexible spacer element for layouts. */
export const FlexSpacer = ({pixels}: FlexSpacerProps) => (
    <div style={{display: "flex", flex: pixels === undefined ? "1 0 auto" : `0 0 ${pixels}px`}}/>
)

/** Property table for {@link FlexSpacer}. */
export const FlexSpacerPropTable = [
    {prop: "pixels", type: "number", description: "Fixed width in pixels when set."}
] as const
