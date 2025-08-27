import {Events, Html} from "@opendaw/lib-dom"
import css from "./TextInput.sass?inline"
import {int, isDefined, isInstanceOf, Lifecycle, MutableObservableValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const defaultClassName = Html.adoptStyleSheet(css, "TextInput")

/** Props for {@link TextInput}. */
export interface TextInputProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Observable string model representing the value. */
    model: MutableObservableValue<string>
    /** Additional CSS class name for the wrapper. */
    className?: string
    /** Maximum number of characters allowed. */
    maxChars?: int
}

/** Editable text field using a `contentEditable` element. */
export const TextInput = ({lifecycle, model, className, maxChars}: TextInputProps) => {
    maxChars ??= 127
    const input: HTMLElement = (<div contentEditable="true" style={{width: "100%"}}/>)
    const element: HTMLElement = (
        <div className={Html.buildClassList(defaultClassName, className)}>
            {input}
        </div>
    )
    const update = () => input.textContent = model.getValue()
    lifecycle.ownAll(
        Events.subscribe(element, "focusin", (event: Event) => {
            if (!isInstanceOf(event.target, HTMLElement)) {return}
            Html.selectContent(event.target)
        }),
        Events.subscribe(element, "focusout", (event: Event) => {
            if (!isInstanceOf(event.target, HTMLElement)) {return}
            update()
            Html.unselectContent(event.target)
        }),
        Events.subscribe(element, "copy", (event: ClipboardEvent) => {
            event.preventDefault()
            event.clipboardData?.setData("application/json", JSON.stringify({
                app: "openDAW",
                content: "text",
                value: model.getValue()
            }))
        }),
        Events.subscribe(element, "paste", (event: ClipboardEvent) => {
            const data = event.clipboardData?.getData("application/json")
            if (isDefined(data)) {
                const json = JSON.parse(data)
                if (json.app === "openDAW" && json.content === "text") {
                    event.preventDefault()
                    model.setValue(json.value)
                }
            }
        }),
        Events.subscribe(element, "input", (event: Event) => {
            const target = event.target
            if (!isInstanceOf(target, HTMLElement)) {return}
            const newValue = target.textContent?.slice(0, maxChars) ?? ""
            model.setValue(newValue)
        })
    )
    update()
    return element
}

/** Property table for {@link TextInput}. */
export const TextInputPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "model", type: "MutableObservableValue<string>", description: "Observable value bound to the input."},
    {prop: "className", type: "string", description: "Additional CSS classes for the wrapper."},
    {prop: "maxChars", type: "int", description: "Maximum number of characters allowed."}
] as const