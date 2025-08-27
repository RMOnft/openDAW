import css from "./TextButton.sass?inline"
import {Exec} from "@opendaw/lib-std"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "TextButton")

/** Props for {@link TextButton}. */
export interface TextButtonProps {
    /** Callback executed when activated. */
    onClick: Exec
}

/** Minimal inline button rendered as text. */
export const TextButton = ({onClick}: TextButtonProps, children: JsxValue) => (
    <div className={className} onclick={onClick}>{children}</div>
)

/** Property table for {@link TextButton}. */
export const TextButtonPropTable = [
    {prop: "onClick", type: "Exec", description: "Callback executed when activated."}
] as const
