import {Comparator, float, int, unitValue} from "@opendaw/lib-std"
import {Event, EventSpan} from "./events"

/** MIDI-style note event with pitch and velocity. */
export interface NoteEvent extends EventSpan {
    readonly type: "note-event"

    /** MIDI note number. */
    get pitch(): int
    /** Cent offset from the pitch. */
    get cent(): number
    /** Velocity value between 0 and 1. */
    get velocity(): float
}

export namespace NoteEvent {
    /** Type guard for {@link NoteEvent}. */
    export const isOfType = (event: Event): event is NoteEvent => event.type === "note-event"

    /** Sorts notes by position and pitch. */
    export const Comparator: Comparator<NoteEvent> = (a, b) => {
        const positionDiff = a.position - b.position
        if (positionDiff !== 0) {return positionDiff}
        const pitchDiff = a.pitch - b.pitch
        if (pitchDiff !== 0) {return pitchDiff}
        // We should allow this and leave it to the user to resolve issues like that
        return 0
    }

    // TODO Replace with https://www.desmos.com/calculator/ekbzuu5j2x
    /** Applies an exponential curve to a ratio. */
    export const curveFunc = (ratio: unitValue, curve: number): unitValue =>
        curve < 0.0 ? ratio ** (2.0 ** -curve) : 1.0 - (1.0 - ratio) ** (2.0 ** curve)

    /** Inverse of {@link curveFunc}. */
    export const inverseCurveFunc = (ratio: unitValue, curve: number): unitValue =>
        curve < 0.0 ? ratio ** (2.0 ** curve) : 1.0 - Math.max(0.0, 1.0 - ratio) ** (2.0 ** -curve)

    /** Comparator that also accounts for event completion time. */
    export const CompleteComparator: Comparator<NoteEvent> = (a: NoteEvent, b: NoteEvent) => {
        const diffComplete = EventSpan.complete(a) - EventSpan.complete(b)
        if (diffComplete !== 0) {return diffComplete}
        return a.pitch - b.pitch
    }
}