import {asDefined, Exec, Procedure, Terminable, Terminator} from "@opendaw/lib-std"
import {Scale} from "@/ui/canvas/scale"
import {AnimationFrame, Html} from "@opendaw/lib-dom"

/**
 * Paints to a canvas element and tracks its resize state.
 *
 * The caller supplies a render callback which is executed whenever an update
 * is requested or the canvas size changes. Pixel dimensions are exposed for
 * convenience.
 */
export class CanvasPainter implements Terminable {
    readonly #rendering: CanvasRenderer

    /**
     * @param canvas - Target canvas element.
     * @param render - Function invoked to draw onto the canvas.
     */
    constructor(canvas: HTMLCanvasElement, render: Procedure<CanvasPainter>) {
        this.#rendering = new CanvasRenderer(canvas, () => render(this))
    }

    /** Queues a render pass on the next animation frame. */
    readonly requestUpdate = (): void => {this.#rendering.requestUpdate()}

    /** Indicates whether the canvas size changed since the last render. */
    get isResized(): boolean {return this.#rendering.isResized}
    /** Device pixel ratio used for rendering. */
    get devicePixelRatio(): number {return this.#rendering.devicePixelRatio}
    /** CSS width of the canvas. */
    get width(): number {return this.#rendering.width}
    /** CSS height of the canvas. */
    get height(): number {return this.#rendering.height}
    /** Physical width in pixels. */
    get actualWidth(): number {return this.#rendering.actualWidth}
    /** Physical height in pixels. */
    get actualHeight(): number {return this.#rendering.actualHeight}
    /** 2D drawing context. */
    get context(): CanvasRenderingContext2D {return this.#rendering.context}
    terminate(): void {this.#rendering.terminate()}
}

/**
 * Extension of {@link CanvasPainter} that maps between pixel and unit
 * coordinates using {@link Scale} instances for each axis.
 */
export class CanvasUnitPainter implements Terminable {
    readonly #rendering: CanvasRenderer

    readonly #xAxis: Scale
    readonly #yAxis: Scale

    /**
     * @param canvas - Target canvas element.
     * @param xAxis - Scale converting horizontal units to normalized values.
     * @param yAxis - Scale converting vertical units to normalized values.
     * @param render - Function invoked to draw using unit coordinates.
     */
    constructor(canvas: HTMLCanvasElement,
                xAxis: Scale,
                yAxis: Scale,
                render: Procedure<CanvasUnitPainter>) {
        this.#rendering = new CanvasRenderer(canvas, () => render(this))
        this.#xAxis = xAxis
        this.#yAxis = yAxis
    }

    /** Queues a render pass on the next animation frame. */
    readonly requestUpdate = (): void => {this.#rendering.requestUpdate()}

    /** Converts an X pixel coordinate to the corresponding unit value. */
    xToUnit(x: number): number {return this.#xAxis.normToUnit(x / this.#rendering.actualWidth)}
    /** Converts a unit value to an X pixel coordinate. */
    unitToX(value: number): number {return this.#xAxis.unitToNorm(value) * this.#rendering.actualWidth}
    /** Converts a Y pixel coordinate to the corresponding unit value. */
    yToUnit(y: number): number {return this.#yAxis.normToUnit(1.0 - y / this.#rendering.actualHeight)}
    /** Converts a unit value to a Y pixel coordinate. */
    unitToY(value: number): number {return (1.0 - this.#yAxis.unitToNorm(value)) * this.#rendering.actualHeight}
    get context(): CanvasRenderingContext2D {return this.#rendering.context}
    get isResized(): boolean {return this.#rendering.isResized}
    get width(): number {return this.#rendering.width}
    get height(): number {return this.#rendering.height}
    get actualWidth(): number {return this.#rendering.actualWidth}
    get actualHeight(): number {return this.#rendering.actualHeight}
    terminate(): void {this.#rendering.terminate()}
}

/** Internal helper managing canvas resizing and render scheduling. */
class CanvasRenderer implements Terminable {
    readonly #lifecycle = new Terminator()

    readonly #context: CanvasRenderingContext2D
    readonly #update: Exec

    #width: number = 0
    #height: number = 0
    #devicePixelRatio: number = 1
    #isResized: boolean = true
    #needsUpdate: boolean = true

    constructor(canvas: HTMLCanvasElement, update: Exec) {
        this.#context = asDefined(canvas.getContext("2d"))
        this.#update = update

        this.#lifecycle.ownAll(
            Html.watchResize(canvas, () => {
                this.#isResized = true
                this.#needsUpdate = true
            }),
            this.#lifecycle.own(AnimationFrame.add(() => {
                const width = canvas.clientWidth
                const height = canvas.clientHeight
                if (!this.#needsUpdate || width === 0 || height === 0) {return}
                this.#isResized = width !== this.#width || height !== this.#height || devicePixelRatio !== this.#devicePixelRatio
                this.#width = width
                this.#height = height
                this.#devicePixelRatio = devicePixelRatio
                canvas.width = width * devicePixelRatio
                canvas.height = height * devicePixelRatio
                this.#update()
                this.#isResized = false
                this.#needsUpdate = false
            }))
        )
    }

    /** True if a size change triggered a new render. */
    get isResized(): boolean {return this.#isResized}
    /** Device pixel ratio used for the last render. */
    get devicePixelRatio(): number {return this.#devicePixelRatio}
    /** CSS width of the canvas. */
    get width(): number {return this.#width}
    /** CSS height of the canvas. */
    get height(): number {return this.#height}
    /** Physical width in pixels. */
    get actualWidth(): number {return this.#width * this.#devicePixelRatio}
    /** Physical height in pixels. */
    get actualHeight(): number {return this.#height * this.#devicePixelRatio}
    /** 2D drawing context. */
    get context(): CanvasRenderingContext2D {return this.#context}
    /** Requests an update on the next animation frame. */
    requestUpdate(): void {this.#needsUpdate = true}
    terminate(): void {this.#lifecycle.terminate()}
}
