import {Nullable} from "@opendaw/lib-std"

/**
 * Converts local coordinates into a captured value.
 *
 * Implementations typically perform hit testing and return either a value
 * describing the hit target or `null` if nothing was captured.
 */
export interface Capturing<T> {capture(localX: number, localY: number): Nullable<T>}

/**
 * Associates a {@link Capturing} implementation with a DOM element and
 * provides helpers to translate various pointer inputs into local coordinates.
 */
export class ElementCapturing<T> {
    readonly #element: Element
    readonly #capturing: Capturing<T>

    /**
     * @param element - The element whose bounds define the local coordinate
     * system.
     * @param capturing - Implementation performing the actual capture.
     */
    constructor(element: Element, capturing: Capturing<T>) {
        this.#element = element
        this.#capturing = capturing
    }

    /** DOM element associated with this capture helper. */
    get element(): Element {return this.#element}
    /** Capture implementation. */
    get capturing(): Capturing<T> {return this.#capturing}

    /**
     * Captures a pointer event using its client coordinates.
     *
     * @param event - Event carrying `clientX`/`clientY` in viewport space.
     */
    captureEvent(event: { clientX: number, clientY: number }): Nullable<T> {
        return this.capturePoint(event.clientX, event.clientY)
    }

    /**
     * Captures an arbitrary client‑space coordinate.
     *
     * @param clientX - X position in viewport space.
     * @param clientY - Y position in viewport space.
     */
    capturePoint(clientX: number, clientY: number): Nullable<T> {
        const {left, top} = this.#element.getBoundingClientRect()
        return this.captureLocalPoint(clientX - left, clientY - top)
    }

    /**
     * Captures a point in the element's local coordinate system.
     *
     * @param x - X position relative to the element's top‑left corner.
     * @param y - Y position relative to the element's top‑left corner.
     */
    captureLocalPoint(x: number, y: number): Nullable<T> {return this.#capturing.capture(x, y)}
}