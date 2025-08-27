import {Lifecycle, MutableObservableValue} from "@opendaw/lib-std"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {Appearance, ButtonCheckboxRadio} from "@/ui/components/ButtonCheckboxRadio.tsx"
import {Html} from "@opendaw/lib-dom"

/** Props for {@link Checkbox}. */
export interface CheckboxProps {
    /** Lifecycle owner for event subscriptions. */
    lifecycle: Lifecycle
    /** Observable model reflecting the checked state. */
    model: MutableObservableValue<boolean>
    /** Inline style applied to the wrapper. */
    style?: Partial<CSSStyleDeclaration>
    /** Additional CSS class name for the wrapper. */
    className?: string
    /** Visual appearance options. */
    appearance?: Appearance
}

/** Toggle control wrapping a native checkbox input. */
export const Checkbox = ({lifecycle, model, style, className, appearance}: CheckboxProps, children: JsxValue) => {
    const id = Html.nextID()
    const input: HTMLInputElement = (
        <input type="checkbox"
               id={id}
               oninput={() => {
                   model.setValue(input.checked)
                   input.checked = model.getValue()
               }}
               checked={model.getValue()}/>
    )
    lifecycle.own(model.subscribe(model => input.checked = model.getValue()))
    return (
        <ButtonCheckboxRadio lifecycle={lifecycle}
                             style={style}
                             className={className}
                             appearance={appearance}
                             dataClass="checkbox">
            {input}
            <label htmlFor={id} style={{cursor: appearance?.cursor ?? "auto"}}>{children}</label>
        </ButtonCheckboxRadio>
    )
}

/** Property table for {@link Checkbox}. */
export const CheckboxPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "model", type: "MutableObservableValue<boolean>", description: "Observable representing the checked state."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the wrapper."},
    {prop: "className", type: "string", description: "Additional CSS class names."},
    {prop: "appearance", type: "Appearance", description: "Visual appearance customisation."}
] as const