import {assert, getOrProvide, isDefined, Lifecycle, MutableObservableValue, ValueOrProvider} from "@opendaw/lib-std"
import {createElement, DomElement} from "@opendaw/lib-jsx"
import {Appearance, ButtonCheckboxRadio} from "@/ui/components/ButtonCheckboxRadio.tsx"
import {TextTooltip} from "@/ui/surface/TextTooltip.tsx"
import {Html} from "@opendaw/lib-dom"

/** Props for {@link RadioGroup}. */
export interface RadioGroupProps<VALUE> {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Observable representing the selected value. */
    model: MutableObservableValue<VALUE>
    /** Definitions for each radio option. */
    elements: ReadonlyArray<Readonly<{ value: VALUE, element: DomElement, tooltip?: ValueOrProvider<string> }>>
    /** Inline style for the wrapper. */
    style?: Partial<CSSStyleDeclaration>
    /** Additional CSS class names. */
    className?: string
    /** Visual appearance customisation. */
    appearance?: Appearance
}

/** Groups several radio buttons sharing a model. */
export const RadioGroup = <T, >({lifecycle, model, elements, style, className, appearance}: RadioGroupProps<T>) => {
    const name = Html.nextID()
    const map = new Map<T, HTMLInputElement>()
    const children: ReadonlyArray<[HTMLInputElement, HTMLLabelElement]> = elements.map(({value, element, tooltip}) => {
        const glue = Html.nextID()
        const input: HTMLInputElement = (
            <input type="radio"
                   id={glue}
                   name={name}
                   checked={value === model.getValue()}
                   oninput={() => {
                       model.setValue(value)
                       input.checked = value === model.getValue()
                   }}/>
        )
        const label = <label htmlFor={glue}>{element}</label>
        if (isDefined(tooltip)) {
            lifecycle.own(TextTooltip.simple(label, () => {
                const clientRect = label.getBoundingClientRect()
                return {
                    clientX: (clientRect.left + clientRect.right) * 0.5,
                    clientY: clientRect.bottom + 8,
                    text: getOrProvide(tooltip)
                }
            }))
        }
        assert(!map.has(value), `${value} is not a unique key`)
        map.set(value, input)
        return [input, label]
    })
    lifecycle.own(model.subscribe(owner => {
        const active = map.get(owner.getValue())
        if (isDefined(active)) {
            console.debug(`RadioGroup.click: ${owner.getValue()}`)
            active.click()
        } else {
            children.forEach(([input]) => input.checked = false)
        }
    }))
    return (
        <ButtonCheckboxRadio lifecycle={lifecycle}
                             style={style}
                             appearance={appearance}
                             className={className}
                             dataClass="radio-group">{children}</ButtonCheckboxRadio>
    )
}

/** Property table for {@link RadioGroup}. */
export const RadioGroupPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "model", type: "MutableObservableValue<any>", description: "Observable representing the selected value."},
    {prop: "elements", type: "ReadonlyArray<{ value: any, element: DomElement, tooltip?: ValueOrProvider<string> }>", description: "Definitions for each radio option."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the wrapper."},
    {prop: "className", type: "string", description: "Additional CSS class names."},
    {prop: "appearance", type: "Appearance", description: "Visual appearance customisation."}
] as const
