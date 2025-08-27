import {Arrays, int} from "@opendaw/lib-std"

/** Helper functions for working with musical chords. */
export namespace Chord {
    export const Major: ReadonlyArray<int> = [0, 2, 4, 5, 7, 9, 11]
    export const Minor: ReadonlyArray<int> = [0, 2, 3, 5, 7, 8, 10]
    export const NoteLabels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    /**
     * Compiles a chord of `n` notes from a given scale.
     *
     * @param scale - Scale intervals.
     * @param root - MIDI note of the root.
     * @param variation - Starting degree within the scale.
     * @param n - Number of notes to generate.
     */
    export const compile = (scale: ReadonlyArray<int>, root: int, variation: int, n: int): ReadonlyArray<int> =>
        Arrays.create(index => {
            const step = variation + index * 2
            const interval = scale[step % 7] + Math.floor(step / 7) * 12
            return root + interval
        }, n)

    /**
     * Converts a MIDI note number into a human-readable note label.
     */
    export const toString = (midiNote: int): string => NoteLabels[midiNote % 12] + (Math.floor(midiNote / 12) - 2)
}