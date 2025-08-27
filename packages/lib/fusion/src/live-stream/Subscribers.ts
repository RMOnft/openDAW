import {Arrays, isDefined, Nullish, SortedSet, Subscription, Terminable} from "@opendaw/lib-std"
import {Address} from "@opendaw/lib-box"

type ListenersEntry<T> = { address: Address, listeners: Array<T> }

/**
 * Maintains a set of listeners grouped by address. Each address can have
 * multiple subscribers which are automatically removed once their
 * {@link Subscription} is terminated.
 */
export class Subscribers<T> implements Terminable {
    readonly #subscribers: SortedSet<Address, ListenersEntry<T>>

    constructor() {this.#subscribers = Address.newSet<ListenersEntry<T>>(entry => entry.address)}

    /** Returns the listeners registered for the given address, if any. */
    getOrNull(address: Address): Nullish<ReadonlyArray<T>> {return this.#subscribers.getOrNull(address)?.listeners}

    /** Checks whether the address currently has no subscribers. */
    isEmpty(address: Address): boolean {return !this.#subscribers.hasKey(address) }

    /**
     * Adds a listener for the specified address and returns a subscription
     * handle that removes it when terminated.
     */
    subscribe(address: Address, listener: T): Subscription {
        const entry = this.#subscribers.getOrNull(address)
        if (isDefined(entry)) {
            entry.listeners.push(listener)
        } else {
            this.#subscribers.add({address, listeners: [listener]})
        }
        return {
            terminate: () => {
                this.#subscribers.opt(address).ifSome(entry => {
                    Arrays.remove(entry.listeners, listener)
                    if (entry.listeners.length === 0) {
                        this.#subscribers.removeByKey(address)
                    }
                })
            }
        }
    }

    /** Removes all listeners for all addresses. */
    terminate(): void {this.#subscribers.clear()}
}