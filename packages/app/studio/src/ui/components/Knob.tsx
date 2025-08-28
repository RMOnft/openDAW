import {isDefined, Lifecycle, Parameter, PI_HALF, TAU, unitValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import css from "./Knob.sass?inline"
import {Html, Svg} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "knob")

/** Configuration of the knob design. */
export interface Design {
    /** Radius defining the overall size. */
    readonly radius: number
    /** Thickness of the track arc. */
    readonly trackWidth: number
    /** Offset limiting the rotation range. */
    readonly angleOffset: number
    /** Start and end of the indicator as fractions of the radius. */
    readonly indicator: [unitValue, unitValue]
    /** Width of the indicator line. */
    readonly indicatorWidth: number
}

/** Default design used by {@link Knob}. */
export const DefaultDesign: Readonly<Design> = Object.freeze({
    radius: 20,
    trackWidth: 1.5,
    angleOffset: Math.PI / 5.0,
    indicator: [0.3, 0.6],
    indicatorWidth: 2.5
} satisfies Design)

/** Compact design variant for small knobs. */
export const TinyDesign: Readonly<Design> = Object.freeze({
    radius: 20,
    trackWidth: 1.5,
    angleOffset: Math.PI / 5.0,
    indicator: [0.2, 0.66],
    indicatorWidth: 2.5
} satisfies Design)

/** Props for {@link Knob}. */
export interface KnobProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Parameter controlling the knob value. */
    value: Parameter
    /** Anchor position used as reference for the indicator. */
    anchor: unitValue
    /** Optional color applied to the knob. */
    color?: string
    /** Custom visual design. */
    design?: Design
}

/**
 * Circular control representing a continuous parameter value.
 *
 * @param lifecycle lifecycle owner for subscriptions
 * @param value parameter controlling the knob
 * @param anchor anchor position for the indicator
 * @param color optional color of the knob
 * @param design custom visual design
 */
export const Knob = ({lifecycle, value, anchor, color, design}: KnobProps) => {
    const {radius, trackWidth, angleOffset, indicator: [min, max], indicatorWidth} = design ?? DefaultDesign

    const trackRadius = Math.floor(radius - trackWidth * 0.5)
    const angleMin = PI_HALF + angleOffset
    const angleMax = PI_HALF - angleOffset
    const angleRange = (TAU - angleOffset * 2.0)
    const angleAnc = angleMin + anchor * angleRange
    const width = radius * 2.0
    const height = radius + Math.ceil(Math.cos(angleOffset) * radius)
    const paths = [
        <path d=""/>,
        <path d="" stroke-linecap="round" stroke-width={indicatorWidth} stroke="rgba(0,0,0,0.5)"/>
    ]
    const update = (unitValue: unitValue) => {
        const angleVal = angleMin + unitValue * angleRange
        const aMinValAnc = Math.min(angleVal, angleAnc)
        const aMaxValAnc = Math.max(angleVal, angleAnc)
        const [value, line] = paths
        value.setAttribute("d", Svg.pathBuilder()
            .circleSegment(0, 0, trackRadius, aMinValAnc - 1.0 / trackRadius, aMaxValAnc + 1.0 / trackRadius)
            .get())
        const cos = Math.cos(angleVal) * trackRadius
        const sin = Math.sin(angleVal) * trackRadius
        line.setAttribute("d", Svg.pathBuilder()
            .moveTo(cos * min, sin * min)
            .lineTo(cos * max, sin * max)
            .get())
    }
    const svg: SVGSVGElement = (
        <svg viewBox={`0 0 ${width} ${height}`} classList={className}>
            <g fill="none"
               stroke="currentColor"
               stroke-linecap="butt"
               stroke-width={trackWidth}
               transform={`translate(${radius}, ${radius})`}>
                <circle r={radius * max} stroke="none" fill="currentColor" classList="light"/>
                <circle r={radius * max} stroke="none" fill="currentColor"/>
                <path stroke="currentColor" stroke-opacity={1 / 3}
                      d={Svg.pathBuilder()
                          .circleSegment(0, 0, trackRadius, angleMin, angleMax)
                          .get()}/>
                {paths}
            </g>
        </svg>
    )
    if (isDefined(color)) {
        svg.style.color = color
    }
    lifecycle.own(value.subscribe(model => update(model.getControlledUnitValue())))
    update(value.getControlledUnitValue())
    return svg
}

/** Property table for {@link Knob}. */
export const KnobPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "value", type: "Parameter", description: "Parameter represented by the knob."},
    {prop: "anchor", type: "unitValue", description: "Reference position for the indicator."},
    {prop: "color", type: "string", description: "Optional color applied to the knob."},
    {prop: "design", type: "Design", description: "Custom design configuration."}
] as const
