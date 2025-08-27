/**
 * Set implementation backed by {@link WeakRef} values. The set automatically
 * purges entries whose targets have been garbage collected.
 */
export class WeakRefSet<T extends WeakKey> {
    readonly #set = new Set<WeakRef<T>>()

    /** Adds a value to the set. */
    add(value: T): void {this.#set.add(new WeakRef<T>(value))}

    /**
     * Iterates over all live entries, removing those whose targets have been
     * collected.
     */
    forEach(callback: (value: T) => void): void {
        for (const weakRef of this.#set) {
            const value = weakRef.deref()
            if (value === undefined) {
                this.#set.delete(weakRef)
            } else {
                callback(value)
            }
        }
    }

    /** Clears all entries from the set. */
    clear(): void {this.#set.clear()}
}