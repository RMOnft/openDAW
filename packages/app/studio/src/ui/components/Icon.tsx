import css from "./Icon.sass?inline"
import {Lifecycle, ObservableValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {IconSymbol} from "@opendaw/studio-adapters"
import {Html} from "@opendaw/lib-dom"

// Attach the component styles and capture the generated class name.
const defaultClassName = Html.adoptStyleSheet(css, "Icon")

/** Props for {@link Icon}. */
export interface IconProps {
    /** Symbol to render. */
    symbol: IconSymbol
    /** Additional CSS classes. */
    className?: string
    /** Optional inline style. */
    style?: Partial<CSSStyleDeclaration>
}

/** Renders an SVG icon symbol. */
export const Icon = ({symbol, className, style}: IconProps) => (
    <svg classList={Html.buildClassList(defaultClassName, className)} style={style}>
        <use href={`#${IconSymbol.toName(symbol)}`}/>
    </svg>
)

/** Props for {@link IconCartridge}. */
export interface IconCartridgeProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Observable icon symbol. */
    symbol: ObservableValue<IconSymbol>
    /** Additional CSS classes. */
    className?: string
    /** Optional inline style. */
    style?: Partial<CSSStyleDeclaration>
}

/** Reactive icon that updates when its symbol changes. */
export const IconCartridge = ({lifecycle, symbol, className, style}: IconCartridgeProps) => {
    const use: SVGUseElement = <use href=""/>
    const updater = () => (use.href.baseVal = `#${IconSymbol.toName(symbol.getValue())}`)
    updater()
    lifecycle.own(symbol.subscribe(updater))
    return (<svg classList={Html.buildClassList(defaultClassName, className)} style={style}>{use}</svg>)
}

/** Property table for {@link Icon}. */
export const IconPropTable = [
    {prop: "symbol", type: "IconSymbol", description: "Symbol to render."},
    {prop: "className", type: "string", description: "Additional CSS classes."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the element."},
] as const

/** Property table for {@link IconCartridge}. */
export const IconCartridgePropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "symbol", type: "ObservableValue<IconSymbol>", description: "Observable icon symbol."},
    {prop: "className", type: "string", description: "Additional CSS classes."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the element."},
] as const
