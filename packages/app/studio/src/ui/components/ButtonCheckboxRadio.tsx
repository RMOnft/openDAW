import css from "./ButtonCheckboxRadio.sass?inline"
import {isDefined, Lifecycle} from "@opendaw/lib-std"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {TextTooltip} from "@/ui/surface/TextTooltip.tsx"
import {CssUtils, Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "ButtonCheckboxRadio")

/** Visual appearance options shared by button-like controls. */
export interface Appearance {
    /** Base color of the control. */
    color?: string
    /** Color used when the control is active. */
    activeColor?: string
    /** Renders an outline around the control. */
    framed?: boolean
    /** Layout children in landscape orientation. */
    landscape?: boolean
    /** Optional tooltip text. */
    tooltip?: string
    /** Cursor style when hovering. */
    cursor?: CssUtils.Cursor
}

/** Props for {@link ButtonCheckboxRadio}. */
export interface ButtonCheckboxRadioProps {
    /** Lifecycle owner used for automatic disposal. */
    lifecycle: Lifecycle
    /** Data-class attribute used for styling. */
    dataClass: string
    /** Inline style applied to the wrapper. */
    style?: Partial<CSSStyleDeclaration>
    /** Additional CSS class name for the wrapper. */
    className?: string
    /** Visual appearance options. */
    appearance?: Appearance
}

/**
 * Common wrapper around input elements that behave like buttons,
 * checkboxes or radio buttons.
 */
export const ButtonCheckboxRadio = (
    {lifecycle, dataClass, style, className: externalClassName, appearance}: ButtonCheckboxRadioProps,
    children: JsxValue) => {
    const wrapper: HTMLElement = (
        <div className={Html.buildClassList(className,
            appearance?.framed && "framed",
            appearance?.landscape && "landscape",
            externalClassName)}
             data-class={dataClass}
             onpointerdown={(event: PointerEvent) => {
                 self.getSelection()?.removeAllRanges()
                 event.preventDefault()
                 event.stopPropagation()
             }}>
            {children}
        </div>
    )

    if (appearance?.tooltip) {
        lifecycle.own(TextTooltip.simple(wrapper, () => {
            const {left, bottom} = wrapper.getBoundingClientRect()
            return {
                clientX: left,
                clientY: bottom + 8,
                text: appearance.tooltip ?? ""
            }
        }))
    }

    if (isDefined(appearance?.color)) {
        wrapper.style.setProperty("--color", appearance.color)
    }
    if (isDefined(appearance?.activeColor)) {
        wrapper.style.setProperty("--color-active", appearance.activeColor)
    }
    if (isDefined(style)) {
        Object.assign(wrapper.style, style)
    }
    return wrapper
}

/** Property table for {@link ButtonCheckboxRadio}. */
export const ButtonCheckboxRadioPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to clean up resources."},
    {prop: "dataClass", type: "string", description: "Value assigned to the data-class attribute."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the wrapper."},
    {prop: "className", type: "string", description: "Additional CSS class applied to the wrapper."},
    {prop: "appearance", type: "Appearance", description: "Visual appearance customisation."}
] as const