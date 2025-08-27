/**
 * Trigger button spawning a {@link Menu} when activated.
 *
 * @see ../../../../../docs/docs-dev/ui/menu/overview.md
 */
import css from "./MenuButton.sass?inline"
import {createElement, JsxValue} from "@opendaw/lib-jsx"
import {MenuItem} from "@/ui/model/menu-item.ts"
import {Menu} from "@/ui/components/Menu.tsx"
import {isDefined, Option} from "@opendaw/lib-std"
import {Surface} from "@/ui/surface/Surface.tsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "MenuButton")

/** Appearance options for {@link MenuButton}. */
export interface MenuButtonAppearance {
    /** Base color of the button. */
    color?: string
    /** Color when the button is active. */
    activeColor?: string
    /** Renders a frame around the button. */
    framed?: boolean
    /** Draws a tiny triangle indicator instead of the default one. */
    tinyTriangle?: boolean
    /** Optional tooltip text. */
    tooltip?: string
}

/** Props for {@link MenuButton}. */
export interface MenuButtonProps {
    /** Root menu item defining the hierarchy to display. */
    root: MenuItem
    /** Inline style applied to the button. */
    style?: Partial<CSSStyleDeclaration>
    /** Visual appearance options. */
    appearance?: MenuButtonAppearance
    /** Horizontal alignment of the menu relative to the button. */
    horizontal?: "left" | "right"
    /** Stretch button to fill available space. */
    stretch?: boolean
    /** Display pointer cursor when hovering. */
    pointer?: boolean
    /** Identifier grouping menus so only one is open at a time. */
    groupId?: string
}

/**
 * Button that opens a {@link Menu} on pointer interaction.
 */
export const MenuButton =
    ({root, style, appearance, horizontal, stretch, pointer, groupId}: MenuButtonProps, children: JsxValue) => {
        let current: Option<Menu> = Option.None
        const button: HTMLButtonElement = (
            <button
                className={Html.buildClassList(className,
                    appearance?.framed && "framed", appearance?.tinyTriangle && "tiny-triangle",
                    stretch && "stretch", pointer && "pointer")}
                onpointerdown={(event: PointerEvent) => {
                    if (event.ctrlKey || !root.hasChildren) {return}
                    event.stopPropagation()
                    toggle()
                }}
                onpointerenter={() => {
                    const focus = button.ownerDocument.activeElement
                    if (focus instanceof HTMLElement && focus.getAttribute("data-menu-group-id") === groupId) {
                        Html.unfocus(focus.ownerDocument.defaultView ?? window)
                        toggle()
                    }
                }}
                title={appearance?.tooltip ?? ""}>{children}</button>
        )
        if (isDefined(appearance?.color)) {
            button.style.setProperty("--color", appearance.color)
        }
        if (isDefined(appearance?.activeColor)) {
            button.style.setProperty("--color-active", appearance.activeColor)
        }
        if (isDefined(style)) {
            Object.assign(button.style, style)
        }
        const toggle = () => {
            current = current.match({
                none: () => {
                    button.classList.add("active")
                    const rect = button.getBoundingClientRect()
                    const menu = Menu.create(root, groupId)
                    menu.moveTo(rect[horizontal ?? "left"], rect.bottom + Menu.Padding)
                    menu.attach(Surface.get(button).flyout)
                    menu.own({terminate: toggle})
                    return Option.wrap(menu)
                },
                some: menu => {
                    button.classList.remove("active")
                    menu.terminate()
                    return Option.None
                }
            })
        }
        return button
    }

/** Property table for {@link MenuButton}. */
export const MenuButtonPropTable = [
    {prop: "root", type: "MenuItem", description: "Root menu item defining the hierarchy."},
    {prop: "style", type: "Partial<CSSStyleDeclaration>", description: "Inline style for the button."},
    {prop: "appearance", type: "MenuButtonAppearance", description: "Visual appearance options."},
    {prop: "horizontal", type: '"left" | "right"', description: "Horizontal alignment for the menu."},
    {prop: "stretch", type: "boolean", description: "Stretch button to fill space."},
    {prop: "pointer", type: "boolean", description: "Show pointer cursor when hovering."},
    {prop: "groupId", type: "string", description: "Group identifier for mutually exclusive menus."}
] as const