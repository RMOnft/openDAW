import css from "./NumberInput.sass?inline"
import {Events, Html} from "@opendaw/lib-dom"
import {int, isDefined, isInstanceOf, Lifecycle, MutableObservableValue, StringMapping} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const defaultClassName = Html.adoptStyleSheet(css, "NumberInput")

/** Props for {@link NumberInput}. */
export interface NumberInputProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Observable numeric model. */
    model: MutableObservableValue<number>
    /** Maps numbers to and from strings. */
    mapper?: StringMapping<number>
    /** Highlight negative values if true. */
    negativeWarning?: boolean
    /** Additional CSS class name. */
    className?: string
    /** Maximum number of characters to display. */
    maxChars?: int
    /** Step value for arrow key adjustments. */
    step?: number
}

/**
 * Editable numeric field with keyboard controls.
 *
 * @returns Element representing the numeric input.
 */
export const NumberInput = ({lifecycle, model, negativeWarning, className, maxChars, mapper, step}: NumberInputProps) => {
    step ??= 1.0
    maxChars ??= 3
    mapper ??= StringMapping.numeric({})
    const input: HTMLElement = (<div contentEditable="true" style={{width: `calc(0.5em + ${maxChars * 6 + 1}px)`}}/>)
    const element: HTMLElement = (
        <div className={Html.buildClassList(defaultClassName, className)}>
            {input}
        </div>
    )
    const updateDigits = () => {
        const value = model.getValue()
        element.classList.toggle("negative", negativeWarning === true && value < 0)
        input.textContent = mapper.x(value).value
    }
    lifecycle.ownAll(
        model.subscribe(updateDigits),
        Events.subscribe(element, "focusin", (event: Event) => {
            if (!isInstanceOf(event.target, HTMLElement)) {return}
            Html.selectContent(event.target)
        }),
        Events.subscribe(element, "focusout", (event: Event) => {
            if (!isInstanceOf(event.target, HTMLElement)) {return}
            updateDigits()
            Html.unselectContent(event.target)
        }),
        Events.subscribe(element, "copy", (event: ClipboardEvent) => {
            event.preventDefault()
            event.clipboardData?.setData("application/json", JSON.stringify({
                app: "openDAW",
                content: "number",
                value: model.getValue()
            }))
        }),
        Events.subscribe(element, "paste", (event: ClipboardEvent) => {
            const data = event.clipboardData?.getData("application/json")
            if (isDefined(data)) {
                const json = JSON.parse(data)
                if (json.app === "openDAW" && json.content === "number") {
                    event.preventDefault()
                    model.setValue(json.value)
                }
            }
        }),
        Events.subscribe(element, "keydown", (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {return}
            const target = event.target
            if (!isInstanceOf(target, HTMLElement)) {return}
            switch (event.code) {
                case "ArrowUp": {
                    event.preventDefault()
                    const result = mapper.y(target.textContent ?? "")
                    if (result.type !== "explicit") {return}
                    const nextValue: int = result.value
                    model.setValue(nextValue + step)
                    Html.selectContent(target)
                    break
                }
                case "ArrowDown": {
                    event.preventDefault()
                    const result = mapper.y(target.textContent ?? "")
                    if (result.type !== "explicit") {return}
                    const nextValue: int = result.value
                    model.setValue(nextValue - step)
                    Html.selectContent(target)
                    break
                }
                case "Enter": {
                    event.preventDefault()
                    const result = mapper.y(target.textContent ?? "")
                    if (result.type !== "explicit") {return}
                    const nextValue: int = result.value
                    model.setValue(nextValue)
                    updateDigits()
                    Html.selectContent(target)
                    break
                }
                case "Digit1":
                case "Digit2":
                case "Digit3":
                case "Digit4":
                case "Digit5":
                case "Digit6":
                case "Digit7":
                case "Digit8":
                case "Digit9":
                case "Digit0":
                case "Tab":
                case "ArrowLeft":
                case "ArrowRight":
                case "Minus":
                case "Backspace": {
                    break // Allow
                }
                default: {
                    console.debug("ignore", event.code)
                    event.preventDefault()
                }
            }
        })
    )
    updateDigits()
    return element
}

/** Property table for {@link NumberInput}. */
export const NumberInputPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "model", type: "MutableObservableValue<number>", description: "Observable numeric model."},
    {prop: "mapper", type: "StringMapping<number>", description: "Maps numbers to and from strings."},
    {prop: "negativeWarning", type: "boolean", description: "Highlight when value is negative."},
    {prop: "className", type: "string", description: "Additional CSS class name."},
    {prop: "maxChars", type: "int", description: "Maximum number of characters to display."},
    {prop: "step", type: "number", description: "Step value for arrow key adjustments."}
] as const
