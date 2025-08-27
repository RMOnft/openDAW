import css from "./Dialog.sass?inline"
import {Exec, Procedure, safeExecute, Terminator} from "@opendaw/lib-std"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {Button} from "@/ui/components/Button.tsx"
import {Icon} from "@/ui/components/Icon.tsx"
import {IconSymbol} from "@opendaw/studio-adapters"
import {Events, Html} from "@opendaw/lib-dom"
import {Colors} from "@opendaw/studio-core"

const className = Html.adoptStyleSheet(css, "Dialog")

export interface DialogHandler {
    close(): void
}

/** Button descriptor used within a {@link Dialog}. */
export interface DialogButton {
    /** Text displayed on the button. */
    text: string
    /** Handler invoked when the button is clicked. */
    onClick: Procedure<DialogHandler>
    /** Marks the button as primary action. */
    primary?: boolean
}

/** Props for {@link Dialog}. */
export interface DialogProps {
    /** Headline displayed at the top of the dialog. */
    headline: string
    /** Icon symbol shown next to the headline. */
    icon: IconSymbol
    /** Callback executed when the dialog is canceled. */
    onCancel?: Exec
    /** Whether the dialog can be closed with the Escape key. */
    cancelable?: boolean
    /** Optional list of action buttons. */
    buttons?: ReadonlyArray<DialogButton>
    /** Inline style applied to the dialog element. */
    style?: Partial<CSSStyleDeclaration>
    /** Renders the dialog in error style. */
    error?: boolean
}

/** Modal dialog component rendered using the native `<dialog>` element. */
export const Dialog = (
    {headline, icon, onCancel, buttons, cancelable, style, error}: DialogProps, children: JsxValue) => {
    const lifecycle = new Terminator()
    const dialog: HTMLDialogElement = (
        <dialog className={Html.buildClassList(className, error && "error")} style={style}>
            <h1><Icon symbol={icon}/> <span>{headline}</span></h1>
            {children}
            <footer>
                {buttons?.map(({onClick, primary, text}) => (
                    <Button lifecycle={lifecycle}
                            onClick={() => onClick({close: () => dialog.close()})}
                            appearance={primary === true ? {
                                framed: true,
                                color: Colors.blue
                            } : {
                                color: Colors.gray
                            }}><span>{text}</span></Button>
                ))}
            </footer>
        </dialog>
    )
    if (cancelable === false) {
        dialog.oncancel = (event) => event.preventDefault()
    }
    dialog.onkeydown = (event) => {
        if (!(cancelable === true && event.key === "Escape") && !Events.isTextInput(event.target)) {
            if (event.code !== "F12") {
                event.preventDefault()
            }
            event.stopPropagation()
        }
    }
    dialog.onclose = () => {
        lifecycle.terminate()
        if (dialog.returnValue === "") {
            safeExecute(onCancel)
        }
        dialog.remove()
    }
    return dialog
}

/** Property table for {@link Dialog}. */
export const DialogPropTable = [
    {prop: "headline", type: "string", description: "Headline displayed in the dialog."},
    {prop: "icon", type: "IconSymbol", description: "Icon shown next to the headline."},
    {prop: "onCancel", type: "Exec", description: "Callback when the dialog is cancelled."},
    {prop: "cancelable", type: "boolean", description: "Whether the Escape key closes the dialog."},
    {prop: "buttons", type: "ReadonlyArray<DialogButton>", description: "Buttons displayed in the footer."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline styles for the dialog element."},
    {prop: "error", type: "boolean", description: "Render dialog with error styling."}
] as const