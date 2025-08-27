import {Procedure} from "@opendaw/lib-std"
import {Inject} from "./inject"

/** DOM element type supported by the JSX helper functions. */
export type DomElement = HTMLElement | SVGElement

/**
 * Any value that can appear within JSX markup including nested arrays and
 * primitive values.
 */
export type JsxValue = null | undefined | boolean | string | number | DomElement | Array<JsxValue>

// These are all utility types to let JSX understand usual HTML and SVG elements.

/**
 * Attributes that receive special handling by the JSX factory.
 */
type AttributeMap = {
    className?: string | Inject.ClassList
    style?: Partial<CSSStyleDeclaration>
}

/**
 * Extracts valid properties from a given DOM element type and augments them
 * with the special attributes understood by this library.
 */
type ExtractProperties<T extends Element> = Partial<{
    [K in keyof T]:
    K extends keyof AttributeMap ? AttributeMap[K] :
        K extends keyof GlobalEventHandlers ? GlobalEventHandlers[K] :
            T[K] extends Function ? never :
                (T[K] extends SVGAnimatedBoolean ? boolean | string :
                    T[K] extends SVGAnimatedAngle ? number | string :
                        T[K] extends SVGAnimatedLength ? number | string :
                            T[K] extends number ? number | string :
                                T[K] extends boolean ? boolean | string :
                                    string) | Inject.Attribute
}> & {
    /** Reference to the backing DOM element. */
    ref?: Inject.Ref<T>
    /** Called when the element has been inserted into the DOM. */
    onLoad?: Procedure<T>
} & Record<string, unknown>

declare global {
    namespace JSX {
        // @ts-ignore
        type IntrinsicElements =
            & { [K in keyof Omit<SVGElementTagNameMap, "a">]: ExtractProperties<Omit<SVGElementTagNameMap, "a">[K]> }
            & { [K in keyof Omit<HTMLElementTagNameMap, "a">]: ExtractProperties<Omit<HTMLElementTagNameMap, "a">[K]> }
            // TODO This guy is really fuzzy. For some reason I cannot type it properly
            & { a: any } // ExtractProperties<HTMLAnchorElement & HTMLElement & HTMLHyperlinkElementUtils>
    }
}