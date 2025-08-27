import {Comparator, int, NumberArray} from "./lang"

/** Lexicographic comparator for strings. */
export const StringComparator: Comparator<string> = (a: string, b: string): number => a > b ? 1 : b > a ? -1 : 0

/** Numeric comparator returning the difference `a - b`. */
export const NumberComparator: Comparator<number> = (a: number, b: number): number => a - b

/**
 * Compares two arrays element by element and falls back to length when all
 * compared elements are equal.
 */
export const NumberArrayComparator: Comparator<NumberArray> = (a, b): number => {
    const n: int = Math.min(a.length, b.length)
    for (let i: int = 0; i < n; i++) {
        const comparison: number = a[i] - b[i]
        if (comparison !== 0.0) {return comparison}
    }
    return a.length - b.length
}