/**
 * Reusable search input element.
 *
 * The component exposes its current value through a
 * {@link MutableObservableValue} and is used by features such as the
 * Spotlight command palette.
 */
import {Html} from "@opendaw/lib-dom"
import css from "./SearchInput.sass?inline"
import {Lifecycle, MutableObservableValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "SearchInput")

/** Props for {@link SearchInput}. */
type Construct = {
    /** Lifecycle owner managing event subscriptions. */
    lifecycle: Lifecycle
    /** Two-way bound model representing the input text. */
    model: MutableObservableValue<string>
    /** Optional placeholder shown when the field is empty. */
    placeholder?: string
    /** Additional inline CSS styles. */
    style?: Partial<CSSStyleDeclaration>
}

/**
 * Renders a search box bound to a mutable observable value.
 *
 * @param lifecycle manages the input's subscriptions
 * @param model holds the current search query
 * @param placeholder optional placeholder text
 * @param style optional inline styles
 */
export const SearchInput = ({lifecycle, model, placeholder, style}: Construct) => {
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