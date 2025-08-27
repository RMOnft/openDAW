import {Comparator, int, panic} from "@opendaw/lib-std"

/**
 * Comparator used for sorting adapter collections by their index field.
 *
 * @see {@link IndexedBoxAdapterCollection}
 */
export const IndexComparator: Comparator<int> = (a: int, b: int): int => {
    if (a === b) {return 0}
    const difference: int = a - b
    if (difference === 0) {
        return panic(`Indices cannot be equal (${a}, ${b})`)
    }
    return difference
}

