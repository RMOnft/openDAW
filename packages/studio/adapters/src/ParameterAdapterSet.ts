import {FieldKeys, PointerTypes, PrimitiveField, PrimitiveValues} from "@opendaw/lib-box"
import {assert, NumberArrayComparator, SortedSet, StringMapping, Terminable, unitValue, ValueMapping} from "@opendaw/lib-std"
import {AutomatableParameterFieldAdapter} from "./AutomatableParameterFieldAdapter"

import {BoxAdaptersContext} from "./BoxAdaptersContext"

/**
 * Maintains the set of {@link AutomatableParameterFieldAdapter} instances that
 * belong to a box.  The set is keyed by the field indices of each parameter
 * allowing fast lookups for automation and UI code.
 */
export class ParameterAdapterSet implements Terminable {
    readonly #context: BoxAdaptersContext
    readonly #parameters: SortedSet<FieldKeys, AutomatableParameterFieldAdapter>

    constructor(context: BoxAdaptersContext) {
        this.#context = context
        this.#parameters = new SortedSet(adapter => adapter.address.fieldKeys, NumberArrayComparator)
    }

    /** Terminates and removes all registered parameter adapters. */
    terminate(): void {
        this.#parameters.forEach(parameter => parameter.terminate())
        this.#parameters.clear()
    }

    /** Returns all registered parameter adapters. */
    parameters(): ReadonlyArray<AutomatableParameterFieldAdapter> {return this.#parameters.values()}

    /** Looks up the adapter at the given field indices. */
    parameterAt(fieldIndices: FieldKeys): AutomatableParameterFieldAdapter {
        return this.#parameters.getOrThrow(fieldIndices,
            () => new Error(`No ParameterAdapter found at [${fieldIndices}]`))
    }

    /**
     * Creates and registers a new parameter adapter for the given field.
     *
     * @returns the newly created adapter
     */
    createParameter<T extends PrimitiveValues>(
        field: PrimitiveField<T, PointerTypes>,
        valueMapping: ValueMapping<T>,
        stringMapping: StringMapping<T>,
        name: string,
        anchor?: unitValue): AutomatableParameterFieldAdapter<T> {
        const adapter = new AutomatableParameterFieldAdapter<T>(this.#context, field, valueMapping, stringMapping, name, anchor)
        const added = this.#parameters.add(adapter)
        assert(added, `Could not add adapter for ${field}`)
        return adapter
    }

    /** Removes the parameter from the set without terminating it. */
    removeParameter<T extends PrimitiveValues>(parameter: AutomatableParameterFieldAdapter<T>): void {
        this.#parameters.removeByValue(parameter)
    }
}