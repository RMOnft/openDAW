import {Event, NoteEvent, ppqn} from "@opendaw/lib-dsp"
import {byte, float, Id, int, Terminable} from "@opendaw/lib-std"

/**
 * Event emitted when a note stops playing.
 */
export type NoteCompleteEvent = Id<Event & {
    readonly type: "note-complete-event"
    readonly pitch: byte
}>

/**
 * Union of note-on and note-off lifecycle events.
 */
export type NoteLifecycleEvent = Id<NoteEvent> | NoteCompleteEvent

export namespace NoteLifecycleEvent {
    /** Creates a note-on event. */
    export const start = (position: ppqn, duration: ppqn, pitch: byte, velocity: float, cent: number = 0.0): Id<NoteEvent> =>
        ({type: "note-event", position, duration, pitch, velocity, cent, id: ++$id})
    /** Clones a note-on event optionally changing position or duration. */
    export const startWith = (source: NoteEvent, position?: ppqn, duration?: ppqn): Id<NoteEvent> => ({
        type: "note-event",
        position: position ?? source.position,
        duration: duration ?? source.duration,
        pitch: source.pitch,
        cent: source.cent,
        velocity: source.velocity,
        id: ++$id
    })
    /** Creates a note-off event from a previously started note. */
    export const stop = ({id, pitch}: Id<NoteEvent>, position: ppqn): NoteCompleteEvent =>
        ({type: "note-complete-event", position, pitch, id})
    /** Type guard for note-on events. */
    export const isStart = (event: Event): event is Id<NoteEvent> =>
        event.type === "note-event" && "id" in event && typeof event.id === "number"
    /** Type guard for note-off events. */
    export const isStop = (event: Event): event is NoteCompleteEvent =>
        event.type === "note-complete-event"
    let $id: int = 0 | 0
}

export interface NoteEventSource {
    /**
     * Finds all notes that start within the interval and returns them in global
     * time space.
     */
    processNotes(from: ppqn, to: ppqn, flags: int /*BlockFlag*/): Generator<NoteLifecycleEvent>

    /** Iterates all active local notes at the given position. */
    iterateActiveNotesAt(position: ppqn, onlyExternal: boolean): Generator<NoteEvent>
}

export interface NoteEventTarget {
    /**
     * Installs a {@link NoteEventSource} and returns a terminable for
     * disconnection.
     */
    setNoteEventSource(source: NoteEventSource): Terminable
}