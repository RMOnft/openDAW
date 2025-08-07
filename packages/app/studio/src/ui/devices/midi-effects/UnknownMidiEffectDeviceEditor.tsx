import css from "./UnknownMidiEffectDeviceEditor.sass?inline"
import {DeviceHost, IconSymbol, UnknownMidiEffectDeviceBoxAdapter} from "@opendaw/studio-adapters"
import {Lifecycle} from "@opendaw/lib-std"
import {DeviceEditor} from "@/ui/devices/DeviceEditor.tsx"
import {MenuItems} from "@/ui/devices/menu-items.ts"
import {createElement} from "@opendaw/lib-jsx"
import {DeviceMidiMeter} from "@/ui/devices/panel/DeviceMidiMeter.tsx"
import {Html} from "@opendaw/lib-dom"
import {StudioService} from "@/service/StudioService"

const className = Html.adoptStyleSheet(css, "UnknownMidiEffectDeviceEditor")

type Construct = {
    lifecycle: Lifecycle
    service: StudioService
    adapter: UnknownMidiEffectDeviceBoxAdapter
    deviceHost: DeviceHost
}

export const UnknownMidiEffectDeviceEditor = ({lifecycle, service, adapter, deviceHost}: Construct) => {
    const {project} = service
    return (
        <DeviceEditor lifecycle={lifecycle}
                      project={project}
                      adapter={adapter}
                      populateMenu={parent => MenuItems.forEffectDevice(parent, service, deviceHost, adapter)}
                      populateControls={() => (
                          <div className={className}>{adapter.commentField.getValue()}</div>
                      )}
                      populateMeter={() => (
                          <DeviceMidiMeter lifecycle={lifecycle}
                                           receiver={project.liveStreamReceiver}
                                           address={adapter.address}/>
                      )}
                      icon={IconSymbol.Note}/>
    )
}