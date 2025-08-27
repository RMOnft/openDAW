import {DeviceInterfaceKnobBox} from "@opendaw/studio-boxes"
import {Address, Box, PointerTypes, PrimitiveField} from "@opendaw/lib-box"
import {ModuleAdapter, Modules} from "./module"
import {BoxAdapter} from "../BoxAdapter"
import {AutomatableParameterFieldAdapter} from "../AutomatableParameterFieldAdapter"
import {BoxAdaptersContext} from "../BoxAdaptersContext"

/**
 * Adapter for elements that appear in a device's user interface. Each element
 * knows the module it belongs to and the parameter it controls.
 */
export interface DeviceInterfaceElementAdapter extends BoxAdapter {
    get moduleAdapter(): ModuleAdapter
    get parameterAdapter(): AutomatableParameterFieldAdapter
}

/** Connects a {@link DeviceInterfaceKnobBox} to its module and parameter. */
export class DeviceInterfaceKnobAdapter implements DeviceInterfaceElementAdapter {
    readonly #context: BoxAdaptersContext
    readonly #box: DeviceInterfaceKnobBox

    constructor(context: BoxAdaptersContext, box: DeviceInterfaceKnobBox) {
        this.#context = context
        this.#box = box
    }

    get box(): Box<PointerTypes, any> {return this.#box}
    get uuid(): Readonly<Uint8Array> {return this.#box.address.uuid}
    get address(): Address {return this.#box.address}

    /** Adapter of the module that owns this UI element. */
    get moduleAdapter(): ModuleAdapter {
        return Modules.adapterFor(this.#context.boxAdapters, this.#parameterTarget.box)
    }

    /** Adapter of the parameter controlled by the UI element. */
    get parameterAdapter(): AutomatableParameterFieldAdapter {
        return this.moduleAdapter.parameters.parameterAt(this.#parameterTarget.address.fieldKeys)
    }

    get #parameterTarget(): PrimitiveField {
        return this.#box.parameter.targetVertex.unwrap("Parameter not assigned") as PrimitiveField
    }

    terminate(): void {
    }
}