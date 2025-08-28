/**
 * Provides a generic wrapper around device editors.
 *
 * The component renders a device header, delegates menu and control creation,
 * and wires up drag-and-drop reordering for effect devices.
 *
 * @packageDocumentation
 */
import css from "./DeviceEditor.sass?inline"
import {Lifecycle, ObservableValue, Procedure, Provider} from "@opendaw/lib-std"
import {createElement, Group, JsxValue} from "@opendaw/lib-jsx"
import {Icon} from "@/ui/components/Icon.tsx"
import {MenuButton} from "@/ui/components/MenuButton.tsx"
import {MenuItem} from "@/ui/model/menu-item"
import {DeviceBoxAdapter, DeviceType, EffectDeviceBoxAdapter, IconSymbol} from "@opendaw/studio-adapters"
import {DebugMenus} from "@/ui/menu/debug.ts"
import {DragDevice} from "@/ui/AnyDragData"
import {DragAndDrop} from "@/ui/DragAndDrop"
import {Events, Html} from "@opendaw/lib-dom"
import {TextScroller} from "@/ui/TextScroller"
import {StringField} from "@opendaw/lib-box"
import {Colors, Project} from "@opendaw/studio-core"

const className = Html.adoptStyleSheet(css, "DeviceEditor")

/**
 * Returns the color used for the editor's header based on device type.
 */
const getColorFor = (type: DeviceType) => {
    switch (type) {
        case "midi-effect":
            return Colors.orange
        case "bus":
        case "instrument":
            return Colors.green
        case "audio-effect":
            return Colors.blue
    }
}

/** Parameters required to construct a {@link DeviceEditor}. */
type Construct = {
    lifecycle: Lifecycle
    project: Project
    adapter: DeviceBoxAdapter
    populateMenu: Procedure<MenuItem>
    populateControls: Provider<JsxValue>
    populateMeter: Provider<JsxValue>
    createLabel?: Provider<HTMLElement>
    icon: IconSymbol
}

/**
 * Creates a label element bound to the box's label field.
 */
const defaultLabelFactory = (lifecycle: Lifecycle, labelField: StringField): Provider<JsxValue> =>
    () => {
        const label: HTMLElement = <h1/>
        lifecycle.ownAll(
            TextScroller.install(label),
            labelField.catchupAndSubscribe(owner => label.textContent = owner.getValue())
        )
        return label
    }

/**
 * Renders an editor for the given device box.
 */
export const DeviceEditor =
    ({lifecycle, project, adapter, populateMenu, populateControls, populateMeter, createLabel, icon}: Construct) => {
        const {editing} = project
        const {box, type, enabledField, minimizedField, labelField} = adapter
        const color = getColorFor(type)
        const header: HTMLElement = (
            <header style={{color}}>
                <div className="icon">
                    <Icon symbol={icon}/>
                </div>
                {(createLabel ?? defaultLabelFactory(lifecycle, labelField))()}
            </header>
        )
        const element: HTMLElement = (
            <div className={Html.buildClassList(className, minimizedField.getValue() && "minimized")} data-drag>
                {header}
                <MenuButton root={MenuItem.root()
                    .setRuntimeChildrenProcedure(parent => {
                        populateMenu(parent)
                        parent.addMenuItem(DebugMenus.debugBox(box))
                    })} style={{minWidth: "0", fontSize: "0.75em"}} appearance={{color, activeColor: Colors.bright}}>
                    <Icon symbol={IconSymbol.Menu}/>
                </MenuButton>
                <Group>{minimizedField.getValue() ? false : populateControls()}</Group>
                <Group>{populateMeter()}</Group>
                <div/>
            </div>
        )
        if (type === "midi-effect" || type === "audio-effect") {
            const effect = adapter as EffectDeviceBoxAdapter
            lifecycle.own(DragAndDrop.installSource(header, () => ({
                type: effect.type,
                start_index: effect.indexField.getValue()
            } satisfies DragDevice), element))
        }
        lifecycle.ownAll(
            enabledField.catchupAndSubscribe((owner: ObservableValue<boolean>) =>
                element.classList.toggle("enabled", owner.getValue())),
            Events.subscribe(header, "dblclick", () => editing.modify(() => minimizedField.toggle()))
        )
        return element
    }
