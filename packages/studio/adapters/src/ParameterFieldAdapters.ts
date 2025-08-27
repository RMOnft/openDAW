import {Option, SortedSet, Terminable} from "@opendaw/lib-std"
import {Address} from "@opendaw/lib-box"
import {AutomatableParameterFieldAdapter} from "./AutomatableParameterFieldAdapter"

/**
 * Indexes all {@link AutomatableParameterFieldAdapter} instances by their
 * {@link Address}.  This allows other components to register parameters and
 * look them up efficiently when automating or rendering user interfaces.
 */
export class ParameterFieldAdapters {
    readonly #set: SortedSet<Address, AutomatableParameterFieldAdapter>

    constructor() {
        this.#set = Address.newSet<AutomatableParameterFieldAdapter>(adapter => adapter.field.address)
    }

    /**
     * Adds an adapter to the collection.
     *
     * @returns handle that removes the adapter on termination
     */
    register(adapter: AutomatableParameterFieldAdapter): Terminable {
        this.#set.add(adapter)
        return {terminate: () => this.#set.removeByValue(adapter)}
    }

    /** Retrieves the adapter associated with the given address. */
    get(address: Address): AutomatableParameterFieldAdapter {return this.#set.get(address)}

    /** Returns the adapter if present. */
    opt(address: Address): Option<AutomatableParameterFieldAdapter> {return this.#set.opt(address)}
}