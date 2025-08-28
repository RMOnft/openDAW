/**
 * Event listener management utilities.
 */
import { Subscription, Terminable } from "./terminable";
import { int, Procedure, safeExecute } from "./lang";

/**
 * Collection managing lifecycle of event listeners.
 *
 * @template T Type describing the listener interface.
 */
export class Listeners<T> implements Terminable {
  readonly #set = new Set<T>();
  readonly #proxy: Required<T>;

  constructor() {
    this.#proxy = new Proxy(
      {},
      {
        get:
          (_: never, func: string): (() => void) =>
          (...args: unknown[]): void =>
            this.#set.forEach((listener: any) => {
              if (Object.getPrototypeOf(listener) === Object.getPrototypeOf({})) {
                return safeExecute(listener[func], ...args);
              }
              return listener[func]?.apply(listener, args);
            }),
      } as const,
    ) as Required<T>;
  }

  /**
   * Proxy forwarding method calls to all registered listeners.
   */
  get proxy(): Required<T> {
    return this.#proxy;
  }

  /** Number of registered listeners. */
  get size(): int {
    return this.#set.size;
  }

  /**
   * Register a listener instance.
   *
   * @param listener - Listener to add.
   * @returns Subscription used to remove the listener.
   */
  subscribe(listener: T): Subscription {
    this.#set.add(listener);
    return { terminate: () => this.#set.delete(listener) };
  }

  /**
   * Iterate through all listeners with a callback.
   *
   * @param procedure - Callback executed for each listener.
   */
  forEach(procedure: Procedure<T>): void {
    this.#set.forEach(procedure);
  }

  /** Remove all registered listeners. */
  terminate(): void {
    this.#set.clear();
  }
}
