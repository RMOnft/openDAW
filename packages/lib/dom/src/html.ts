import {asDefined, assert, Color, int, isDefined, panic, Rect, Subscription} from "@opendaw/lib-std"

/**
 * DOM helper utilities.
 */
export namespace Html {
    /**
     * Parses a string of markup into a single HTML or SVG element.
     *
     * @example
     * ```ts
     * const div = Html.parse('<div class="foo"></div>');
     * document.body.append(div);
     * ```
     */
    export const parse = (source: string): HTMLOrSVGElement & Element => {
        const template = document.createElement("div")
        template.innerHTML = source
        if (template.childElementCount !== 1) {
            return panic(`Source html has more than one root elements: '${source}'`)
        }
        const child = template.firstChild
        return child instanceof HTMLElement || child instanceof SVGSVGElement
            ? child
            : panic(`Cannot parse to HTMLOrSVGElement from '${source}'`)
    }

    /**
     * Removes all child nodes from an element.
     */
    export const empty = (element: Element): void => {while (element.firstChild !== null) {element.firstChild.remove()}}

    /**
     * Replaces the children of an element with new nodes or HTML strings.
     */
    export const replace = (element: Element, ...elements: ReadonlyArray<string | Element>): void => {
        Html.empty(element)
        element.append(...elements)
    }

    /**
     * Shorthand for `querySelector` that asserts the element exists.
     */
    export const query = <E extends Element>(selectors: string, parent: ParentNode = document): E =>
        asDefined(parent.querySelector(selectors)) as E

    /**
     * Returns all elements matching the selector as a plain array.
     */
    export const queryAll = <E extends Element>(selectors: string, parent: ParentNode = document): ReadonlyArray<E> =>
        Array.from(parent.querySelectorAll(selectors))

    /**
     * Generates a short unique identifier used for CSS classes.
     */
    export const nextID = (() => {
        let id: int = 0 | 0
        return (): string => (++id).toString(16).padStart(4, "0")
    })()

    /**
     * Registers a `CSSStyleSheet` replacing the `component` placeholder with a
     * unique class name and returns that class.
     */
    export const adoptStyleSheet = (classDefinition: string, prefix?: string): string => {
        assert(classDefinition.includes("component"), `No 'component' found in: ${classDefinition}`)
        const className = `${prefix ?? "C"}${Html.nextID()}`
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(classDefinition.replaceAll("component", `.${className}`))
        if (sheet.cssRules.length === 0) {
            return panic(`No cssRules found in: ${classDefinition}`)
        }
        document.adoptedStyleSheets.push(sheet)
        return className
    }

    /**
     * Allows conditional accumulation of class names.
     *
     * @example
     * ```ts
     * Html.buildClassList("foo", condition && "bar");
     * ```
     */
    export const buildClassList = (...input: Array<string | false | undefined>) =>
        input.filter(x => x !== false && x !== undefined).join(" ")

    /**
     * Converts CSS color values into {@link Color.RGBA} objects by applying
     * them to a temporary DOM element.
     */
    export const readCssVarColor = (...cssValues: Array<string>): Array<Color.RGBA> => {
        const element = document.createElement("div")
        document.body.appendChild(element)
        const colors: Array<Color.RGBA> = cssValues.map(value => {
            element.style.color = value
            return Color.parseCssRgbOrRgba(getComputedStyle(element).color)
        })
        element.remove()
        return colors
    }

    /**
     * Observes size changes on an element via `ResizeObserver`.
     *
     * @example
     * ```ts
     * const sub = Html.watchResize(el, entry => console.log(entry.contentRect));
     * // later: sub.terminate();
     * ```
     */
    export const watchResize = (target: Element,
                                callback: (entry: ResizeObserverEntry, observer: ResizeObserver) => void,
                                options?: ResizeObserverOptions): Subscription => {
        const observer = new ResizeObserver(([first], observer) => callback(first, observer))
        observer.observe(target, options)
        return {terminate: () => observer.disconnect()}
    }

    /**
     * Observes element visibility via `IntersectionObserver`.
     */
    export const watchIntersection = (target: Element,
                                      callback: IntersectionObserverCallback,
                                      options?: IntersectionObserverInit): Subscription => {
        const observer = new IntersectionObserver(callback, options)
        observer.observe(target)
        return {terminate: () => observer.disconnect()}
    }

    /**
     * Computes a bounding box, recursing into children for elements with no
     * box (e.g. `display: contents`).
     */
    export const secureBoundingBox = (element: Element): DOMRect => {
        const elemRect = element.getBoundingClientRect()
        if (!Rect.isEmpty(elemRect)) {
            return elemRect
        }
        for (const child of element.children) {
            Rect.union(elemRect, secureBoundingBox(child))
        }
        return elemRect
    }

    /**
     * Removes focus from the active element if possible.
     */
    export const unfocus = (owner: Window = self) => {
        const element = owner.document.activeElement
        if (element !== null && "blur" in element && typeof element.blur === "function") {
            element.blur()
        }
    }

    /**
     * Selects the textual contents of an element.
     */
    export const selectContent = (element: HTMLElement) => {
        const range = document.createRange()
        const selection = window.getSelection()
        if (isDefined(selection)) {
            range.selectNodeContents(element)
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }

    /**
     * Clears any selection inside the given element.
     */
    export const unselectContent = (element: HTMLElement) => {
        const selection = window.getSelection()
        if (!isDefined(selection) || selection.rangeCount === 0) {return}
        if (element.contains(selection.getRangeAt(0).commonAncestorContainer)) {
            selection.removeAllRanges()
        }
    }

    /**
     * Limits the string length of a property on an element and keeps the cursor
     * at the end.
     */
    export const limitChars = <T extends HTMLElement, K extends keyof T & string>(element: T, property: K, limit: int) => {
        if (!(property in element)) return panic(`${property} not found in ${element}`)
        if (typeof element[property] !== "string") return panic(`${property} in ${element} is not a string`)
        if (element[property].length > limit) {
            element[property] = element[property].substring(0, limit) as T[K]
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                element.setSelectionRange(limit, limit)
            } else {
                const document = element.ownerDocument
                const range = document.createRange()
                const selection = document.defaultView?.getSelection()
                if (!isDefined(selection)) {return}
                range.selectNodeContents(element)
                range.collapse(false)
                selection.removeAllRanges()
                selection.addRange(range)
            }
        }
    }

    /**
     * Data URL for a single pixel transparent gif.
     */
    export const EmptyGif = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" as const
}


