import { Arrays, assert, Exec } from "@opendaw/lib-std";

import { IconSymbol } from "@opendaw/studio-adapters";

/** A search result entry returned by {@link SpotlightDataSupplier.query}. */
export type SpotlightResult = {
  name: string;
  icon: IconSymbol;
  exec: Exec;
};

/** Action that can be registered with the spotlight. */
export type SpotlightAction = {
  name: string;
  exec: Exec;
};

/**
 * Maintains a list of actions for the spotlight command palette and performs
 * simple prefix matching.
 */
export class SpotlightDataSupplier {
  #actions: Array<SpotlightAction>;

  constructor() {
    this.#actions = [];
  }

  /** Performs a prefix search over registered actions. */
  query(text: string): ReadonlyArray<SpotlightResult> {
    text = text.trim().toLowerCase();
    if (text.length === 0) {
      return Arrays.empty();
    }
    return this.#actions
      .filter((action) => action.name.toLowerCase().startsWith(text))
      .map(({ name, exec }) => ({ name, icon: IconSymbol.Play, exec }));
    // TODO Search for more entries
  }

  /** Registers a new action, asserting that the name is unique. */
  registerAction(name: string, exec: Exec): void {
    assert(
      -1 === this.#actions.findIndex((action) => action.name === name),
      `${name} already exists`,
    );
    this.#actions.push({ name, exec });
  }
}
