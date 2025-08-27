import {byte, Terminable, unitValue} from "@opendaw/lib-std"

/**
 * Abstraction for sending note events to an instrument or processor.
 *
 * @remarks
 * Used by adapters to trigger notes on devices such as the
 * {@link @opendaw/studio-core-processors#PlayfieldDeviceProcessor | Playfield} instrument.
 */
export interface NoteSender {
    /** Starts a note with the given velocity. */
    noteOn(note: byte, velocity: unitValue): void
    /** Stops a playing note. */
    noteOff(note: byte): void
}

/** Utilities for sustaining notes until explicitly released. */
export namespace NoteSustainer {
    /**
     * Starts a note and returns a handle that releases it when terminated.
     */
    export const start = (sender: NoteSender, note: byte, velocity: unitValue = 1.0): Terminable => {
        let playing = true
        sender.noteOn(note, velocity)
        return {
            terminate: () => {
                if (playing) {
                    sender.noteOff(note)
                    playing = false
                }
            }
        }
    }
}
