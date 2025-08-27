import {Subscription} from "./terminable"
import {int} from "./lang"

/** Coordinate pair used when selecting items in two dimensional space. */
export type Coordinates<U, V> = { u: U, v: V }

/** Component that reacts when it becomes selected. */
export interface Selectable {
    onSelected(): void
    onDeselected(): void
}

/** Listener notified of selection changes. */
export interface SelectionListener<SELECTABLE> {
    onSelected(selectable: SELECTABLE): void
    onDeselected(selectable: SELECTABLE): void
}

/**
 * Mutable set of selected items.
 */
export interface Selection<SELECTABLE> {
    /** Adds the given selectables to the selection. */
    select(...selectables: Array<SELECTABLE>): void
    /** Removes the given selectables from the selection. */
    deselect(...selectables: Array<SELECTABLE>): void
    /** Clears the selection. */
    deselectAll(): void
    /** Checks whether the selectable is currently selected. */
    isSelected(selectable: SELECTABLE): boolean
    /** True if no elements are selected. */
    isEmpty(): boolean
    /** Number of selected items. */
    count(): int
    /** Returns a snapshot of selected items. */
    selected(): ReadonlyArray<SELECTABLE>
    /**
     * Returns selectables from inventory which are nearest to the current selection.
     */
    distance(inventory: ReadonlyArray<SELECTABLE>): ReadonlyArray<SELECTABLE>
    /** Subscribe to selection events. */
    subscribe(listener: SelectionListener<SELECTABLE>): Subscription
    /** Subscribe and immediately receive current selection. */
    catchupAndSubscribe(listener: SelectionListener<SELECTABLE>): Subscription
}

/** Locates selectable items based on coordinates. */
export interface SelectableLocator<SELECTABLE, U, V> {
    /** Selectable at a specific coordinate. */
    selectableAt(coordinates: Coordinates<U, V>): Iterable<SELECTABLE>
    /** Selectables within the rectangular region between coordinates. */
    selectablesBetween(selectionBegin: Coordinates<U, V>, selectionEnd: Coordinates<U, V>): Iterable<SELECTABLE>
    /** Iterable of all selectables. */
    selectable(): Iterable<SELECTABLE>
}
