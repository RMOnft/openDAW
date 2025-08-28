import {Event} from "@opendaw/lib-dsp"
import {ArrayMultimap, Arrays, int} from "@opendaw/lib-std"

/**
 * Small helper collecting {@link Event}s grouped by block index.
 */
export class EventBuffer {
    readonly #events: ArrayMultimap<int, Event>

    constructor() {this.#events = new ArrayMultimap(Arrays.empty(), Event.Comparator)}

    /**
     * Adds an event scheduled for the given block.
     *
     * @param index - Render block index for which the event should fire.
     * @param event - Event instance to store.
     */
    add(index: int, event: Event): void {this.#events.add(index, event)}
    /**
     * Returns the events for the block or an empty array.
     *
     * @param index - Block index to retrieve events for.
     * @returns All events scheduled for that block.
     */
    get(index: int): ReadonlyArray<Event> {return this.#events.get(index)}
    /**
     * Iterates over all stored block/event pairs.
     *
     * @param procedure - Callback invoked with the block index and its events.
     */
    forEach(procedure: (index: int, values: ReadonlyArray<Event>) => void): void {return this.#events.forEach(procedure)}
    /** Clears all stored events. */
    clear(): void {this.#events.clear()}
}