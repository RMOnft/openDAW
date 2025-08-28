/** @file Collection tracking automatable parameter adapters by address. */
import { Option, SortedSet, Terminable } from "@opendaw/lib-std";
import { Address } from "@opendaw/lib-box";
import { AutomatableParameterFieldAdapter } from "./AutomatableParameterFieldAdapter";

/**
 * Indexes all {@link AutomatableParameterFieldAdapter} instances by their
 * {@link Address}.  This allows other components to register parameters and
 * look them up efficiently when automating or rendering user interfaces.
 */
export class ParameterFieldAdapters {
  readonly #set: SortedSet<Address, AutomatableParameterFieldAdapter>;

  constructor() {
    this.#set = Address.newSet<AutomatableParameterFieldAdapter>(
      (adapter) => adapter.field.address,
    );
  }

  /**
   * Adds an adapter to the collection.
   *
   * @param adapter - adapter instance to track
   * @returns handle that removes the adapter on termination
   */
  register(adapter: AutomatableParameterFieldAdapter): Terminable {
    this.#set.add(adapter);
    return { terminate: () => this.#set.removeByValue(adapter) };
  }

  /**
   * Retrieves the adapter associated with the given address.
   *
   * @param address - field address to look up
   */
  get(address: Address): AutomatableParameterFieldAdapter {
    return this.#set.get(address);
  }

  /**
   * Returns the adapter if present.
   *
   * @param address - field address to look up
   */
  opt(address: Address): Option<AutomatableParameterFieldAdapter> {
    return this.#set.opt(address);
  }
}
