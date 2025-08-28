import css from "./SnapSelector.sass?inline"
import {Lifecycle} from "@opendaw/lib-std"
import {MenuButton} from "@/ui/components/MenuButton.tsx"
import {Snapping} from "@/ui/timeline/Snapping.ts"
import {Icon} from "@/ui/components/Icon.tsx"
import {createElement, Inject} from "@opendaw/lib-jsx"
import {IconSymbol} from "@opendaw/studio-adapters"
import {Html} from "@opendaw/lib-dom"
import {Colors} from "@opendaw/studio-core"

const className = Html.adoptStyleSheet(css, "SnapSelector")

/** Parameters for constructing {@link SnapSelector}. */
export type Construct = {
    /** Lifecycle managing subscriptions. */
    lifecycle: Lifecycle
    /** Snap settings that provide available options. */
    snapping: Snapping
}

/**
 * Dropdown for selecting timeline snap resolution.
 *
 * @example
 * ```tsx
 * <SnapSelector lifecycle={lifecycle} snapping={snapping} />
 * ```
 *
 * @public
 */
export const SnapSelector = ({lifecycle, snapping}: Construct) => {
    const snappingName = Inject.value(snapping.unit.name)
    lifecycle.own(snapping.subscribe(snapping => {snappingName.value = snapping.unit.name}))
    return (
        <div className={className}>
            <label>Snap</label>
            <MenuButton root={Snapping.createMenuRoot(snapping)}
                        appearance={{framed: true, color: Colors.gray, activeColor: Colors.bright}}>
                <label style={{minWidth: "5em"}}>{snappingName}<Icon symbol={IconSymbol.Dropdown}/></label>
            </MenuButton>
        </div>
    )
}
