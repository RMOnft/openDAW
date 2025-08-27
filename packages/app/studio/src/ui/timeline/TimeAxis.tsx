import css from "./TimeAxis.sass?inline"
import {clamp, EmptyExec, isDefined, Lifecycle, Nullable, Option} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {Propagation} from "@opendaw/lib-box"
import {StudioService} from "@/service/StudioService.ts"
import {TimeGrid} from "@/ui/timeline/TimeGrid.ts"
import {TimelineRange} from "@/ui/timeline/TimelineRange.ts"
import {Snapping} from "@/ui/timeline/Snapping.ts"
import {CanvasPainter} from "@/ui/canvas/painter.ts"
import {ppqn, PPQN} from "@opendaw/lib-dsp"
import {Dragging, Events, Html} from "@opendaw/lib-dom"
import {DblClckTextInput} from "@/ui/wrapper/DblClckTextInput"
import {TextTooltip} from "@/ui/surface/TextTooltip"
import {Colors} from "@opendaw/studio-core"

/** CSS class applied to the axis container. */
const className = Html.adoptStyleSheet(css, "time-axis")

// Reasonable bounds for track duration in bars.
const MIN_TRACK_DURATION = 8 * PPQN.Bar
const MAX_TRACK_DURATION = 1024 * PPQN.Bar

/** Parameters for constructing {@link TimeAxis}. */
type Construct = {
    /** Lifecycle managing subscriptions. */
    lifecycle: Lifecycle
    /** Service providing access to engine and project. */
    service: StudioService
    /** Snap settings controlling cursor rounding. */
    snapping: Snapping
    /** Visible range of the timeline. */
    range: TimelineRange
    /** Optional mapper for custom cursor positioning. */
    mapper?: TimeAxisCursorMapper
}

/** Maps playback position to a different pulse value when drawing the cursor. */
export interface TimeAxisCursorMapper {
    mapPlaybackCursor(position: ppqn): ppqn
}

/**
 * Visualizes tempo grid and current playback position.
 *
 * @param lifecycle - Lifecycle for resource cleanup.
 * @param service - Access to engine and project state.
 * @param snapping - Snap settings for cursor interactions.
 * @param range - Range object describing current viewport.
 * @param mapper - Optional mapper for custom cursor rendering.
 */
export const TimeAxis = ({lifecycle, service, snapping, range, mapper}: Construct) => {
    let endMarkerPosition: Nullable<ppqn> = null
    const {project: {timelineBox: {signature, durationInPulses}, editing, boxGraph}} = service
    const position = service.engine.position
    const canvas: HTMLCanvasElement = <canvas/>
    const painter = lifecycle.own(new CanvasPainter(canvas, ({context}) => {
        const {height} = canvas
        const {fontFamily, fontSize} = getComputedStyle(canvas)
        context.fillStyle = Colors.shadow
        context.textBaseline = "alphabetic"
        context.font = `${parseFloat(fontSize) * devicePixelRatio}px ${fontFamily}`
        const textY = height - 4 * devicePixelRatio
        const {nominator, denominator} = signature
        TimeGrid.fragment([nominator.getValue(), denominator.getValue()],
            range, ({bars, beats, isBar, isBeat, pulse}) => {
                const x = Math.floor(range.unitToX(pulse) * devicePixelRatio)
                const textX = x + 5
                if (isBar) {
                    context.fillRect(x, 0, 2, height)
                    context.fillText((bars + 1).toFixed(0), textX, textY)
                } else if (isBeat) {
                    context.fillRect(x, height * 0.5, 1, height * 0.5)
                    context.fillRect(x, height * 0.5, 4, 1)
                    context.fillText((bars + 1) + "•" + (beats + 1), textX, textY)
                } else {
                    context.fillRect(x, height * 0.5, 1, height * 0.5)
                }
            })
        const pulse = service.engine.playbackTimestamp.getValue()
        const x = Math.floor(range.unitToX(pulse) * devicePixelRatio)
        context.fillStyle = "rgba(255, 255, 255, 0.25)"
        context.fillRect(x, 0, devicePixelRatio, height)
    }))
    const cursorElement: HTMLDivElement = <div className="cursor" data-component="cursor"/>
    // Position cursor according to playback progress.
    const updateCursor = () => {
        const pulses = isDefined(mapper) ? mapper.mapPlaybackCursor(position.getValue()) : position.getValue()
        const x = Math.floor(range.unitToX(pulses))
        cursorElement.style.left = `${x}px`
        cursorElement.style.visibility = 0 < x && x < range.width ? "visible" : "hidden"
    }
    const endMarkerElement: HTMLDivElement = <div className="end-marker" data-component="end-marker"/>
    // Move end marker with project duration or temporary override.
    const updateEndMarker = () => {
        const pulses = endMarkerPosition ?? durationInPulses.getValue()
        endMarkerElement.style.left = `${Math.floor(range.unitToX(pulses))}px`
        endMarkerElement.style.visibility = range.unitMin <= pulses && pulses < range.unitMax ? "visible" : "hidden"
    }
    const onResize = () => {
        if (!canvas.isConnected) {return}
        range.width = canvas.clientWidth
        painter.requestUpdate()
        updateCursor()
        updateEndMarker()
    }
    lifecycle.ownAll(
        range.subscribe(updateCursor),
        range.subscribe(updateEndMarker),
        position.subscribe(updateCursor),
        durationInPulses.catchupAndSubscribe(() => updateEndMarker()),
        Dragging.attach(canvas, () => Option.wrap({
            update: (event: Dragging.Event) => {
                const x = event.clientX - canvas.getBoundingClientRect().left
                const p = Math.max(0, range.xToUnit(x))
                // Move playback position and keep cursor within view.
                service.engine.setPosition(snapping.round(p))
                if (p < range.unitMin) {
                    range.moveToUnit(p)
                } else if (p > range.unitMax) {
                    range.moveToUnit(p - range.unitRange)
                }
            }
        }), {immediate: true, permanentUpdates: false}),
        TextTooltip.simple(endMarkerElement, () => {
            const rect = endMarkerElement.getBoundingClientRect()
            return ({
                text: "Double-click to edit",
                clientX: rect.left,
                clientY: rect.top + 24
            })
        }),
        Events.subscribe(canvas, "wheel", (event: WheelEvent) => {
            event.preventDefault()
            const scale = event.deltaY * 0.01
            const rect = canvas.getBoundingClientRect()
            // Zoom and scroll the range based on wheel input.
            range.scaleBy(scale, range.xToValue(event.clientX - rect.left))
            range.moveBy(event.deltaX * 0.00001)
        }, {passive: false}),
        Html.watchResize(canvas, onResize),
        range.subscribe(painter.requestUpdate),
        service.engine.playbackTimestamp.subscribe(painter.requestUpdate),
        boxGraph.subscribeVertexUpdates(Propagation.Children, signature.address, painter.requestUpdate)
    )
    return (
        <div className={className}>
            {canvas}
            <DblClckTextInput resolversFactory={() => {
                const resolvers = Promise.withResolvers<string>()
                resolvers.promise.then((value: string) => {
                    const number = parseFloat(value)
                    if (isNaN(number)) {return}
                    editing.modify(() => durationInPulses.setValue(clamp(number * PPQN.Bar, MIN_TRACK_DURATION, MAX_TRACK_DURATION)))
                }, EmptyExec)
                return resolvers
            }} provider={() => ({
                unit: "bars",
                value: PPQN.toParts(durationInPulses.getValue() - PPQN.Bar).bars.toString()
            })} location={() => {
                const rect = endMarkerElement.getBoundingClientRect()
                return {x: rect.left - 32, y: rect.top}
            }}>
                {endMarkerElement}
            </DblClckTextInput>
            {cursorElement}
        </div>
    )
}