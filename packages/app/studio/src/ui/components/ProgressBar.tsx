import {Html} from "@opendaw/lib-dom"
import css from "./ProgressBar.sass?inline"
import {Lifecycle, ObservableValue, unitValue} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"

const className = Html.adoptStyleSheet(css, "ProgressBar")

/** Props for {@link ProgressBar}. */
export interface ProgressBarProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Progress value in the range [0,1]. */
    progress: ObservableValue<unitValue>
}

/** Visual progress indicator. */
export const ProgressBar = ({lifecycle, progress}: ProgressBarProps) => {
    const element: HTMLElement = (
        <div className={className}>
            <div/>
        </div>
    )
    const update = () => element.style.setProperty("--progress", progress.getValue().toFixed(3))
    lifecycle.own(progress.subscribe(update))
    update()
    return element
}

/** Property table for {@link ProgressBar}. */
export const ProgressBarPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "progress", type: "ObservableValue<unitValue>", description: "Progress value between 0 and 1."}
] as const
