import css from "./FloatingTextInput.sass?inline"
import {isDefined, Point} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "TextInput")

/** Props for {@link FloatingTextInput}. */
export interface FloatingTextInputProps {
    /** Promise resolvers used to resolve or reject user input. */
    resolvers?: PromiseWithResolvers<string>
    /** Absolute screen position to place the input at. */
    position?: Point
    /** Initial value shown inside the field. */
    value?: boolean | number | string
    /** Unit string displayed next to the value. */
    unit?: string
}

/**
 * Light-weight text input that floats at an arbitrary screen position.
 */
export const FloatingTextInput = ({resolvers, position, value, unit}: FloatingTextInputProps) => {
    const inputField: HTMLInputElement = (<input type="text" value={isDefined(value) ? String(value) : ""}/>)
    requestAnimationFrame(() => {
        inputField.select()
        inputField.focus()
    })
    if (isDefined(resolvers)) {
        const {reject, resolve} = resolvers
        const remove = () => {
            inputField.onblur = null
            inputField.onkeydown = null
            element.remove()
        }
        inputField.onblur = () => {
            remove()
            reject("cancel")
        }
        inputField.onkeydown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "enter") {
                const value = inputField.value
                remove()
                resolve(value)
            }
        }
    }
    const element: HTMLElement = (
        <div className={className} unit={unit}
             style={isDefined(position) ? {
                 position: "absolute",
                 transform: `translate(${position.x}px, ${position.y}px)`
             } : {}}>
            {inputField}
        </div>
    )
    return element
}

/** Property table for {@link FloatingTextInput}. */
export const FloatingTextInputPropTable = [
    {prop: "resolvers", type: "PromiseWithResolvers<string>", description: "Resolvers to resolve or cancel input."},
    {prop: "position", type: "Point", description: "Absolute screen position."},
    {prop: "value", type: "boolean | number | string", description: "Initial value shown in the field."},
    {prop: "unit", type: "string", description: "Unit text displayed next to the value."}
] as const