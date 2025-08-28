import {BlockFlag, ProcessInfo} from "./processing"
import {Event} from "@opendaw/lib-dsp"
import {EngineContext} from "./EngineContext"
import {Arrays, Bits, int, Terminable} from "@opendaw/lib-std"
import {AbstractProcessor} from "./AbstractProcessor"
import {EventBuffer} from "./EventBuffer"
import {Fragmentor} from "@opendaw/lib-dsp"
import {UpdateClockRate} from "@opendaw/studio-adapters"

/**
 * Automation update event distributed by the {@link UpdateClock}.
 *
 * The event carries the absolute transport position at which the update should
 * occur. Consumers typically translate this into UI refreshes or other
 * time‑based tasks.
 */
export interface UpdateEvent extends Event {type: "update-event"}

export namespace UpdateEvent {
    /** Type guard for {@link UpdateEvent}. */
    export const isOfType = (event: Event): event is UpdateEvent => event.type === "update-event"
}

/**
 * Audio engine processor that schedules periodic {@link UpdateEvent}s.
 *
 * The events are emitted within the worker thread and used to drive UI
 * updates or other time-based tasks in the main thread at the rate
 * specified by {@link UpdateClockRate}.
 */
export class UpdateClock extends AbstractProcessor {
    readonly #outputs: Array<EventBuffer> = []

    /**
     * @param context - Engine execution context that owns the processor.
     */
    constructor(context: EngineContext) {
        super(context)
        this.own(this.context.registerProcessor(this))
    }

    /** Clears pending input events. */
    reset(): void {this.eventInput.clear()}

    /**
     * Adds another event buffer that should receive update events.
     *
     * @param output - Buffer to append generated {@link UpdateEvent}s to.
     * @returns Terminable that removes the buffer when invoked.
     */
    addEventOutput(output: EventBuffer): Terminable {
        this.#outputs.push(output)
        return {terminate: () => Arrays.remove(this.#outputs, output)}
    }

    /**
     * Walks the render blocks and emits {@link UpdateEvent}s at the configured
     * {@link UpdateClockRate}. Only blocks flagged as transporting will trigger
     * updates.
     *
     * @param blocks - Render blocks describing the current processing slice.
     */
    process({blocks}: ProcessInfo): void {
        blocks.forEach(({p0, p1, flags}, index: int) => {
            if (!Bits.every(flags, BlockFlag.transporting)) {return}
            for (const position of Fragmentor.iterate(p0, p1, UpdateClockRate)) {
                const event: UpdateEvent = {type: "update-event", position}
                this.#outputs.forEach(output => output.add(index, event))
            }
        })
    }

    toString(): string {return `{${this.constructor.name}}`}
}
