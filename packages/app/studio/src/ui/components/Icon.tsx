import css from "./Icon.sass?inline"
import {Lifecycle, ObservableValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {IconSymbol} from "@opendaw/studio-adapters"
import {Html} from "@opendaw/lib-dom"

// Attach the component styles and capture the generated class name.
const defaultClassName = Html.adoptStyleSheet(css, "Icon")

/**
 * Stateless SVG icon component.
 *
 * The `symbol` prop references an `<svg><symbol/></svg>` definition and is
 * rendered using the `<use>` element. Additional classes or style overrides can
 * be supplied via `className` and `style`.
 */
export const Icon = ({symbol, className, style}: {
    symbol: IconSymbol,
    className?: string,
    style?: Partial<CSSStyleDeclaration>
}) => (
    <svg classList={Html.buildClassList(defaultClassName, className)} style={style}>
        <use href={`#${IconSymbol.toName(symbol)}`}/>
    </svg>
)

/**
 * Cartridge variant that updates the `<use>` element when the provided
 * `ObservableValue` changes.
 */
export const IconCartridge = ({lifecycle, symbol, className, style}: {
    lifecycle: Lifecycle,
    symbol: ObservableValue<IconSymbol>,
    className?: string,
    style?: Partial<CSSStyleDeclaration>
}) => {
    const use: SVGUseElement = <use href=""/>
    const updater = () => (use.href.baseVal = `#${IconSymbol.toName(symbol.getValue())}`)
    updater()
    lifecycle.own(symbol.subscribe(updater))
    return <svg classList={Html.buildClassList(defaultClassName, className)} style={style}>{use}</svg>
}
