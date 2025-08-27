import {Html} from "@opendaw/lib-dom"
import css from "./SearchInput.sass?inline"
import {Lifecycle, MutableObservableValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "SearchInput")

/** Props for {@link SearchInput}. */
export interface SearchInputProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Observable search string. */
    model: MutableObservableValue<string>
    /** Placeholder text when empty. */
    placeholder?: string
    /** Inline style for the element. */
    style?: Partial<CSSStyleDeclaration>
}

/** Styled search input bound to a model. */
export const SearchInput = ({lifecycle, model, placeholder, style}: SearchInputProps) => {
    const input: HTMLInputElement = (
        <input type="search"
               value={model.getValue()}
               className={className}
               placeholder={placeholder}
               style={style} oninput={(event) => {
            if (event.target instanceof HTMLInputElement) {
                model.setValue(event.target.value)
            }
        }}/>
    )
    lifecycle.own(model.subscribe(owner => input.value = owner.getValue()))
    return input
}

/** Property table for {@link SearchInput}. */
export const SearchInputPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "model", type: "MutableObservableValue<string>", description: "Observable search string."},
    {prop: "placeholder", type: "string", description: "Placeholder text when empty."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the element."}
] as const
