import {asDefined, Func, int, Nullable, NumberArray, panic} from "./lang"

/**
 * Defines sort order helpers for {@link Arrays.isSorted} and other utilities.
 */
export enum Sorting {Ascending = 1, Descending = -1}

/**
 * Collection of helpers for working with {@link Array} instances.
 * All functions are static and side–effect free unless otherwise stated.
 */
export class Arrays {
    /** Internal empty array used by {@link Arrays.empty}. */
    static readonly #empty = Object.freeze(new Array<never>(0))

    /**
     * Returns a frozen empty array that can be reused without additional
     * allocations.
     */
    static readonly empty = <T>(): ReadonlyArray<T> => (() => this.#empty)()

    /** Removes all elements from {@link array}. */
    static readonly clear = <T>(array: Array<T>): void => {array.length = 0}

    /** Replaces the contents of {@link array} with {@link newValues}. */
    static readonly replace = <T>(array: Array<T>, newValues: Array<T>): void => {
        array.length = 0
        array.push(...newValues)
    }

    /**
     * Consumes the array by invoking {@link procedure} for each element and
     * removing entries for which the procedure returns `true`.
     */
    static readonly consume = <T>(array: Array<T>, procedure: Func<T, boolean>): void => {
        for (let index = 0; index < array.length;) {
            if (procedure(array[index])) {array.splice(index, 1)} else {index++}
        }
    }

    /** Returns the first element or `null` if the array is empty. */
    static readonly peekFirst = <T>(array: ReadonlyArray<T>): Nullable<T> => array.at(0) ?? null

    /** Returns the last element or `null` if the array is empty. */
    static readonly peekLast = <T>(array: ReadonlyArray<T>): Nullable<T> => array.at(-1) ?? null

    /** Retrieves the first element and throws with {@link fail} if absent. */
    static readonly getFirst = <T>(array: ReadonlyArray<T>, fail: string): T => asDefined(array.at(0), fail)

    /** Retrieves the last element and throws with {@link fail} if absent. */
    static readonly getLast = <T>(array: ReadonlyArray<T>, fail: string): T => asDefined(array.at(-1), fail)

    /**
     * Returns the element before {@link element} in {@link array}. Throws if the
     * element cannot be found.
     */
    static readonly getPrev = <T>(array: Array<T>, element: T): T => {
        const index: int = array.indexOf(element)
        if (index === -1) {return panic(`${element} not found in ${array}`)}
        return asDefined(array.at((index - 1) % array.length), "Internal Error")
    }

    /**
     * Returns the element after {@link element} in {@link array}. Throws if the
     * element cannot be found.
     */
    static readonly getNext = <T>(array: Array<T>, element: T): T => {
        const index: int = array.indexOf(element)
        if (index === -1) {return panic(`${element} not found in ${array}`)}
        return asDefined(array.at((index + 1) % array.length), "Internal Error")
    }

    /** Removes and returns the last element of {@link array}. */
    static readonly removeLast = <T>(array: Array<T>, fail: string): T => asDefined(array.pop(), fail)

    /**
     * Creates a new array of length {@link n} by invoking {@link factory} for
     * each index.
     */
    static readonly create = <T>(factory: Func<int, T>, n: int): Array<T> => {
        const array: T[] = new Array<T>(n)
        for (let i: int = 0; i < n; i++) {array[i] = factory(i)}
        return array
    }

    /**
     * Compares two array-like objects for strict equality of all elements and
     * length.
     */
    static readonly equals = <T>(a: ArrayLike<T>, b: ArrayLike<T>) => {
        if (a.length !== b.length) {return false}
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {return false}
        }
        return true
    }

    /**
     * Checks whether all elements in {@link array} satisfy the provided
     * {@link predicate} when compared to the first element.
     */
    static readonly satisfy = <T>(array: ReadonlyArray<T>, predicate: (a: T, b: T) => boolean): boolean => {
        if (array.length < 2) {return true}
        const first = array[0]
        for (let i = 1; i < array.length; i++) {
            if (!predicate(first, array[i])) {return false}
        }
        return true
    }

    /** Removes the first occurrence of {@link element} from {@link array}. */
    static readonly remove = <T>(array: Array<T>, element: T): void => {
        const index: int = array.indexOf(element)
        if (index === -1) {return panic(`${element} not found in ${array}`)}
        array.splice(index, 1)
    }

    /**
     * Removes {@link element} from {@link array} if present and returns whether
     * a removal happened.
     */
    static readonly removeOpt = <T>(array: Array<T>, element: T): boolean => {
        const index: int = array.indexOf(element)
        if (index === -1) {return false}
        array.splice(index, 1)
        return true
    }

    /** Returns `true` if {@link array} contains duplicate values. */
    static readonly hasDuplicates = <T>(array: Array<T>): boolean => new Set<T>(array).size < array.length

    /**
     * Removes duplicate values from {@link array} in-place while preserving
     * order.
     */
    static readonly removeDuplicates = <T>(array: Array<T>): Array<T> => {
        let index = 0 | 0
        const result = new Set<T>()
        for (const element of array) {
            if (!result.has(element)) {
                result.add(element)
                array[index++] = element
            }
        }
        array.length = index
        return array
    }

    /**
     * Removes duplicates based on the value of {@link key} for each element in
     * {@link array}.
     */
    static readonly removeDuplicateKeys = <T, K extends keyof T>(array: Array<T>, key: K): Array<T> => {
        let index = 0 | 0
        const seen = new Set<T[K]>()
        for (const element of array) {
            const value = element[key]
            if (!seen.has(value)) {
                seen.add(value)
                array[index++] = element
            }
        }
        array.length = index
        return array
    }

    /** Iterates over the array yielding each element in order. */
    static* iterate<T>(array: ArrayLike<T>): Generator<T> {
        for (let i: int = 0; i < array.length; i++) {
            yield array[i]
        }
    }

    /** Iterates over the array in reverse order. */
    static* iterateReverse<T>(array: ArrayLike<T>): Generator<T> {
        for (let i: int = array.length - 1; i >= 0; i--) {
            yield array[i]
        }
    }

    /**
     * Iterates over the array yielding objects that also indicate whether the
     * current element is the first or last one.
     */
    static* iterateStateFull<T>(array: ArrayLike<T>): Generator<{ value: T, isFirst: boolean, isLast: boolean }> {
        const maxIndex = array.length - 1
        for (let i: int = 0; i <= maxIndex; i++) {
            yield {value: array[i], isFirst: i === 0, isLast: i === maxIndex}
        }
    }

    /**
     * Determines whether the numeric {@link array} is sorted in the specified
     * {@link sorting} order.
     */
    static isSorted<ARRAY extends NumberArray>(array: ARRAY, sorting: Sorting = Sorting.Ascending): boolean {
        if (array.length < 2) {return true}
        let prev: number = array[0]
        for (let i: int = 1; i < array.length; i++) {
            const next: number = array[i]
            if (Math.sign(prev - next) === sorting) {return false}
            prev = next
        }
        return true
    }
}