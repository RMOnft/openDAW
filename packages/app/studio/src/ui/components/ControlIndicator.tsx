import {Lifecycle} from "@opendaw/lib-std"
import {AutomatableParameterFieldAdapter} from "@opendaw/studio-adapters"
import {createElement, Group, JsxValue} from "@opendaw/lib-jsx"

/** Props for {@link ControlIndicator}. */
export interface ControlIndicatorProps {
    /** Lifecycle owner for subscriptions. */
    lifecycle: Lifecycle
    /** Parameter to observe for automation. */
    parameter: AutomatableParameterFieldAdapter
}

/** Adds an automation indicator to its children. */
export const ControlIndicator = ({lifecycle, parameter}: ControlIndicatorProps, children: JsxValue) => {
    const element: HTMLElement = <Group>{children}</Group>
    lifecycle.own(parameter.catchupAndSubscribeControlSources({
        onControlSourceAdd: () => element.classList.add("automated"),
        onControlSourceRemove: () => element.classList.remove("automated")
    }))
    return element
}

/** Property table for {@link ControlIndicator}. */
export const ControlIndicatorPropTable = [
    {prop: "lifecycle", type: "Lifecycle", description: "Owner used to dispose subscriptions."},
    {prop: "parameter", type: "AutomatableParameterFieldAdapter", description: "Parameter to observe for automation."}
] as const
