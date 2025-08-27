import {Exec, Nullable, Provider} from "./lang"
import {Terminable} from "./terminable"

/** Simple lazy-initialising cache backed by a provider function. */
export class Cache<T> implements Terminable {
    readonly #provider: Provider<T>

    #value: Nullable<T> = null

    constructor(provider: Provider<T>) {this.#provider = provider}

    /** Clears the cached value. */
    readonly invalidate: Exec = () => this.#value = null

    /** Returns the cached value, invoking the provider on first access. */
    get(): T {
        if (this.#value === null) {this.#value = this.#provider()}
        return this.#value
    }

    terminate(): void {this.invalidate()}
}