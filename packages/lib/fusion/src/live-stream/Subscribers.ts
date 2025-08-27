import {Arrays, isDefined, Nullish, SortedSet, Subscription, Terminable} from "@opendaw/lib-std"
import {Address} from "@opendaw/lib-box"

type ListenersEntry<T> = { address: Address, listeners: Array<T> }

/**
 * Helper structure for mapping addresses to listener arrays. It supports
 * subscription management and automatic cleanup when all listeners of an
 * address are removed.
 */
export class Subscribers<T> implements Terminable {
    readonly #subscribers: SortedSet<Address, ListenersEntry<T>>

    constructor() {this.#subscribers = Address.newSet<ListenersEntry<T>>(entry => entry.address)}

    /** Retrieve listeners for an address if present. */
    getOrNull(address: Address): Nullish<ReadonlyArray<T>> {return this.#subscribers.getOrNull(address)?.listeners}

    /** Check whether an address has any subscribers. */
    isEmpty(address: Address): boolean {return !this.#subscribers.hasKey(address) }

    /**
     * Add a listener for the given address and return a subscription used to
     * remove it.
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

    /** Remove all listeners from all addresses. */
    terminate(): void {this.#subscribers.clear()}
}