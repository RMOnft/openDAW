import {ModuleGainBox} from "@opendaw/studio-boxes"
import {Pointers} from "@opendaw/studio-enums"
import {StringMapping, ValueMapping} from "@opendaw/lib-std"
import {AbstractModuleAdapter} from "../abstract"
import {ModuleAdapter} from "../module"
import {AutomatableParameterFieldAdapter} from "../../AutomatableParameterFieldAdapter"
import {Direction, ModuleConnectorAdapter} from "../connector"
import {BoxAdaptersContext} from "../../BoxAdaptersContext"

/** Adapter for the gain module. */
export class ModuleGainAdapter extends AbstractModuleAdapter<ModuleGainBox> implements ModuleAdapter {
    readonly #parameterGain: AutomatableParameterFieldAdapter<number>
    readonly #voltageInput: ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Input>
    readonly #voltageOutput: ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Output>

    constructor(context: BoxAdaptersContext, box: ModuleGainBox) {
        super(context, box)

        this.#parameterGain = this.parameters.createParameter(box.gain,
            ValueMapping.DefaultDecibel,
            StringMapping.numeric({unit: "db"}),
            "Gain")
        this.#voltageInput = ModuleConnectorAdapter.create(context.boxAdapters, box.voltageInput, Direction.Input, "Input")
        this.#voltageOutput = ModuleConnectorAdapter.create(context.boxAdapters, box.voltageOutput, Direction.Output, "Output")
    }

    /** Gain parameter measured in decibels. */
    get parameterGain(): AutomatableParameterFieldAdapter<number> {return this.#parameterGain}
    /** Incoming voltage connection. */
    get voltageInput(): ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Input> {return this.#voltageInput}
    /** Outgoing voltage connection. */
    get voltageOutput(): ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Output> {return this.#voltageOutput}

    get inputs(): ReadonlyArray<ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Input>> {
        return [this.#voltageInput]
    }
    get outputs(): ReadonlyArray<ModuleConnectorAdapter<Pointers.VoltageConnection, Direction.Output>> {
        return [this.#voltageOutput]
    }
}