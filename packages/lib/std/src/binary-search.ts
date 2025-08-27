import {Comparator, Func, int} from "./lang"

/**
 * Implementation of the classic binary search algorithm operating on
 * sorted arrays.  All comparison logic is delegated to a provided
 * {@link Comparator} allowing use with arbitrary types.
 *
 * @see https://en.wikipedia.org/wiki/Binary_search_algorithm
 */
export namespace BinarySearch {
    /**
     * Searches for an exact match of {@link key} in {@link sorted} and returns
     * its index or `-1` if the key is absent.
     */
    export const exact = <T>(sorted: ReadonlyArray<T>, key: T, comparator: Comparator<T>): int => {
        let l: int = 0 | 0
        let r: int = sorted.length - 1
        while (l <= r) {
            const m: int = (l + r) >>> 1
            const cmp = comparator(sorted[m], key)
            if (cmp === 0) {return m}
            if (cmp < 0) {l = m + 1} else {r = m - 1}
        }
        return -1
    }

    /**
     * Variant of {@link exact} that first maps each element using
     * {@link map} before comparison.
     */
    export const exactMapped = <T, U>(sorted: ReadonlyArray<U>, key: T, comparator: Comparator<T>, map: Func<U, T>): int => {
        let l: int = 0 | 0
        let r: int = sorted.length - 1
        while (l <= r) {
            const m: int = (l + r) >>> 1
            const cmp = comparator(map(sorted[m]), key)
            if (cmp === 0) {return m}
            if (cmp < 0) {l = m + 1} else {r = m - 1}
        }
        return -1
    }

    /**
     * Returns the left-most index at which {@link key} could be inserted while
     * preserving order. When {@link key} exists, its first occurrence is
     * returned.
     */
    export const leftMost = <T>(sorted: ReadonlyArray<T>, key: T, comparator: Comparator<T>): int => {
        let l: int = 0 | 0
        let r: int = sorted.length
        while (l < r) {
            const m: int = (l + r) >>> 1
            if (comparator(sorted[m], key) < 0) {
                l = m + 1
            } else {
                r = m
            }
        }
        return l
    }

    /**
     * Returns the right-most index of {@link key}. If the key does not exist the
     * index of its floor value is returned.
     */
    export const rightMost = <T>(sorted: ReadonlyArray<T>, key: T, comparator: Comparator<T>): int => {
        let l: int = 0 | 0
        let r: int = sorted.length
        while (l < r) {
            const m: int = (l + r) >>> 1
            if (comparator(sorted[m], key) <= 0) {
                l = m + 1
            } else {
                r = m
            }
        }
        return r - 1
    }

    /**
     * {@link leftMost} operating on mapped values.
     */
    export const leftMostMapped =
        <T, U>(sorted: ReadonlyArray<U>, key: T, comparator: Comparator<T>, map: Func<U, T>): int => {
            let l: int = 0 | 0
            let r: int = sorted.length
            while (l < r) {
                const m: int = (l + r) >>> 1
                if (comparator(map(sorted[m]), key) < 0) {
                    l = m + 1
                } else {
                    r = m
                }
            }
            return l
        }

    /**
     * {@link rightMost} operating on mapped values.
     */
    export const rightMostMapped =
        <T, U>(sorted: ReadonlyArray<U>, key: T, comparator: Comparator<T>, map: Func<U, T>): int => {
            let l: int = 0 | 0
            let r: int = sorted.length
            while (l < r) {
                const m: int = (l + r) >>> 1
                if (comparator(map(sorted[m]), key) <= 0) {
                    l = m + 1
                } else {
                    r = m
                }
            }
            return r - 1
        }

    /**
     * Returns the range of indices `[left, right]` for all elements matching
     * {@link key}. When the key is missing, the insertion point and floor index
     * are returned instead.
     */
    export const rangeMapped =
        <T, U>(sorted: ReadonlyArray<U>, key: T, comparator: Comparator<T>, map: Func<U, T>): [int, int] =>
            [leftMostMapped(sorted, key, comparator, map), rightMostMapped(sorted, key, comparator, map)]
}