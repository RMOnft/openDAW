import {Subscription, Terminable} from "./terminable"
import {Observer} from "./observers"
import {Observable} from "./observables"

/**
 * Simple observable implementation for manually notifying observers.
 */
export class Notifier<T> implements Observable<T>, Terminable {
    /**
     * Subscribes an observer to multiple observables and returns a combined
     * subscription for easy disposal.
     */
    static subscribeMany<T extends Observable<any>>(observer: Observer<T>,
                                                    ...observables: ReadonlyArray<T>): Subscription {
        return Terminable.many(...observables
            .map(observable => observable.subscribe(() => observer(observable))))
    }

    readonly #observers: Set<Observer<T>> = new Set<Observer<T>>() // A set allows us to remove while iterating

    subscribe(observer: Observer<T>): Subscription {
        this.#observers.add(observer)
        return {terminate: (): unknown => this.#observers.delete(observer)}
    }

    /** True if no observers are registered. */
    isEmpty(): boolean {return this.#observers.size === 0}
    /** Notify all observers with the given value. */
    notify(value: T): void {this.#observers.forEach((observer: Observer<T>) => observer(value))}
    /** Direct access to the underlying set of observers. */
    observers(): Set<Observer<T>> {return this.#observers}
    /** Removes all observers and releases references. */
    terminate(): void {this.#observers.clear()}
}