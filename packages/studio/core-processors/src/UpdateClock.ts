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
 */
export interface UpdateEvent extends Event {type: "update-event"}

export namespace UpdateEvent {
    /** Type guard for {@link UpdateEvent}. */
    export const isOfType = (event: Event): event is UpdateEvent => event.type === "update-event"
}

/**
 * Generates {@link UpdateEvent}s at a fixed rate while the transport is
 * running and dispatches them to registered outputs.
 */
export class UpdateClock extends AbstractProcessor {
    readonly #outputs: Array<EventBuffer> = []

    constructor(context: EngineContext) {
        super(context)

        this.own(this.context.registerProcessor(this))
    }

    reset(): void {this.eventInput.clear()}

    /** Adds another event buffer that should receive update events. */
    addEventOutput(output: EventBuffer): Terminable {
        this.#outputs.push(output)
        return {terminate: () => Arrays.remove(this.#outputs, output)}
    }

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