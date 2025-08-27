import {Exec, Nullable, Provider} from "./lang"
import {Terminable} from "./terminable"

/**
 * Lazily caches the result of a provider function.
 *
 * The provider is invoked on the first call to {@link get} and the
 * resulting value is stored until {@link invalidate} or {@link terminate}
 * is called. The class implements {@link Terminable} so it can be
 * integrated into larger lifecycles.
 *
 * @typeParam T – Type of value produced by the provider.
 */
export class Cache<T> implements Terminable {
    readonly #provider: Provider<T>

    #value: Nullable<T> = null

    /** Create a cache backed by the given provider. */
    constructor(provider: Provider<T>) {this.#provider = provider}

    /** Clears the cached value so the provider will be invoked again. */
    readonly invalidate: Exec = () => this.#value = null

    /**
     * Retrieve the cached value, invoking the provider on first access.
     */
    get(): T {
        if (this.#value === null) {this.#value = this.#provider()}
        return this.#value
    }

    /** @inheritDoc */
    terminate(): void {this.invalidate()}
}
