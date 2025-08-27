/**
 * Bitmask based configuration panel for enabling notes in a scale.
 */
import css from "./ScaleConfigurator.sass?inline"
import {Arrays, int, Lifecycle} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {ScaleConfig} from "@/ui/timeline/editors/notes/pitch/ScaleConfig.ts"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "ScaleConfigurator")

/** Parameters for {@link ScaleConfigurator}. */
type Construct = {
    lifecycle: Lifecycle
    scale: ScaleConfig
}

/**
 * Renders a 12-tone toggle grid allowing fine grained scale definition.
 */
export const ScaleConfigurator = ({lifecycle, scale}: Construct) => {
    const buttons: ReadonlyArray<HTMLDivElement> = Arrays.create((index: int) => (
        <div onclick={() => scale.toggle(index)}/>
    ), 12)
    const updater = () => buttons.forEach((button, index) => button.classList.toggle("active", scale.getBit(index)))
    lifecycle.own(scale.subscribe(updater))
    updater()
    return (<div className={className}>{buttons}</div>)
}