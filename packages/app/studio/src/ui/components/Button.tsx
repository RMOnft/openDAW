import {Lifecycle, Procedure} from "@opendaw/lib-std"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {Appearance, ButtonCheckboxRadio} from "@/ui/components/ButtonCheckboxRadio"
import {Html} from "@opendaw/lib-dom"

/**
 * Props for {@link Button}.
 */
export interface ButtonProps {
    /** Manages subscriptions to allow proper cleanup. */
    lifecycle: Lifecycle
    /** Callback executed when the button is clicked. */
    onClick: Procedure<MouseEvent>
    /** Optional inline style applied to the wrapper element. */
    style?: Partial<CSSStyleDeclaration>
    /** Visual customisation forwarded to {@link ButtonCheckboxRadio}. */
    appearance?: Appearance
}

/**
 * Renders a clickable button using {@link ButtonCheckboxRadio} styling.
 *
 * @param lifecycle - {@link Lifecycle} owner of event subscriptions
 * @param onClick - called when the button is activated
 */
export const Button = ({lifecycle, onClick, style, appearance}: ButtonProps, children: JsxValue) => {
    const id = Html.nextID()
    const input: HTMLInputElement = <input type="button" id={id} onclick={onClick}/>
    return (
        <ButtonCheckboxRadio lifecycle={lifecycle} style={style} appearance={appearance} dataClass="button">
            {input}
            <label htmlFor={id}>{children}</label>
        </ButtonCheckboxRadio>
    )
}

/**
 * Property table for {@link Button}.
 */
export const ButtonPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Manages subscriptions for cleanup."},
    {prop: "onClick", type: "Procedure<MouseEvent>", description: "Invoked when the button is clicked."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the wrapper element."},
    {prop: "appearance", type: "Appearance", description: "Visual customisation of the control."}
] as const