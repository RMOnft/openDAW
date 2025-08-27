import {int, panic, unitValue} from "@opendaw/lib-std"

const LogDb = Math.log(10.0) / 20.0

/** Converts MIDI note numbers to frequency in hertz. */
export const midiToHz = (note: number = 60.0, baseFrequency: number = 440.0): number =>
    baseFrequency * Math.pow(2.0, (note + 3.0) / 12.0 - 6.0)
/** Converts a frequency to its nearest MIDI note number. */
export const hzToMidi = (hz: number, baseFrequency: number = 440.0): number =>
    (12.0 * Math.log(hz / baseFrequency) + 69.0 * Math.LN2) / Math.LN2
/** Converts decibels to linear gain. */
export const dbToGain = (db: number): number => Math.exp(db * LogDb)
/** Converts linear gain to decibels. */
export const gainToDb = (gain: number): number => Math.log(gain) / LogDb
/** Converts MIDI velocity (0–1) to linear gain. */
export const velocityToGain = (velocity: unitValue): number => dbToGain(20 * Math.log10(velocity))
/** Calculates BPM from a number of bars and duration in seconds. */
export const barsToBpm = (bars: number, duration: number): number => (bars * 240.0) / duration
/** Calculates number of bars played over a duration at given BPM. */
export const bpmToBars = (bpm: number, duration: number): number => (bpm * duration) / 240.0
/** Estimates a likely BPM given a duration and maximum allowed tempo. */
export const estimateBpm = (duration: number, maxBpm: number = 180.0): number => {
    const bpm = barsToBpm(Math.pow(2.0, Math.floor(Math.log(bpmToBars(maxBpm, duration)) / Math.LN2)), duration)
    return Math.round(bpm * 1000.0) / 1000.0
}
/** Converts a MIDI semitone value to frequency. */
export const semitoneToHz = (semitones: number) => 440 * Math.pow(2.0, (semitones - 69.0) / 12.0)
/** Converts frequency to a MIDI semitone value. */
export const hzToSemitone = (hz: number) => 69.0 + 12.0 * Math.log2(hz / 440.0)
/** Parses a time signature string (e.g. "4/4"). */
export const parseTimeSignature = (input: string): [int, int] => {
    const [first, second] = input.split("/")
    const numerator = parseInt(first, 10)
    const denominator = parseInt(second, 10)
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
        return panic("Invalid format. Must be two integers separated by '/'")
    }
    if ((denominator & (denominator - 1)) !== 0) {
        return panic("Denominator must be a power of two")
    }
    return [numerator, denominator]
}