import {Arrays} from "./arrays"
import {EmptyExec, Exec, Func} from "./lang"
import {Observer} from "./observers"

/** Object that can release resources. */
export interface Terminable {terminate(): void}

/** Entity that manages one or more {@link Terminable} instances. */
export interface TerminableOwner {
    /** Register a terminable to be disposed with the owner. */
    own<T extends Terminable>(terminable: T): T
    /** Register multiple terminables at once. */
    ownAll<T extends Terminable>(...terminables: Array<T>): void
    /** Creates a child {@link Terminator} linked to this owner. */
    spawn(): Terminator
}

// alias
export type Subscription = Terminable
export type Lifecycle = TerminableOwner

export const Terminable = Object.freeze({
    Empty: {terminate: EmptyExec},
    create: (exec: Exec) => ({terminate: exec}),
    many: (...terminables: Terminable[]): Terminable =>
        ({terminate: (): void => {while (terminables.length > 0) {terminables.pop()!.terminate()}}})
} as const)

/**
 * Default implementation that tracks registered terminables and
 * disposes them when terminated.
 */
export class Terminator implements TerminableOwner, Terminable {
    readonly #terminables: Terminable[] = []

    own<T extends Terminable>(terminable: T): T {
        this.#terminables.push(terminable)
        return terminable
    }

    ownAll<T extends Terminable>(...terminables: Array<T>): void {
        for (const terminable of terminables) {this.#terminables.push(terminable)}
    }

    spawn(): Terminator {
        const terminator = new Terminator()
        terminator.own({terminate: () => Arrays.removeOpt(this.#terminables, terminator)})
        return this.own(terminator)
    }

    /** Terminates all registered resources in reverse order. */
    terminate(): void {while (this.#terminables.length > 0) {this.#terminables.pop()!.terminate()}}
}

/** Simple flag based implementation of {@link Terminable}. */
export class VitalSigns implements Terminable {
    #terminated: boolean = false
    get isTerminated(): boolean {return this.#terminated}
    terminate(): void {this.#terminated = true}
}

/**
 * Helper to manage nested subscriptions. Each new value disposes the
 * previous subscription chain before creating a new one.
 */
export class CascadingSubscriptions {
    #current: Terminator

    constructor() {this.#current = new Terminator()}

    next(): {
        own: (subscription: Subscription) => Subscription
        toObserver: <T>(fn: Func<T, Subscription>) => Observer<T>
    } {
        const current = this.#current
        const nested = current.own(new Terminator())
        this.#current = nested
        return {
            own: (subscription: Subscription): Subscription => {
                current.own(subscription)
                return current
            },
            toObserver: <T>(fn: Func<T, Subscription>): Observer<T> => (value: T) => {
                nested.terminate()
                nested.own(fn(value))
            }
        }
    }

    append<T>(subscribe: Func<Observer<T>, Subscription>, observer: Func<T, Subscription>): Subscription {
        const current = this.#current
        const nested = current.own(new Terminator())
        current.own(subscribe((value: T) => {
            nested.terminate()
            nested.own(observer(value))
        }))
        this.#current = nested
        return current
    }
}