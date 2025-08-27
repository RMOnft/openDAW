const key = Symbol.for("@openDAW/lib-dsp")

if ((globalThis as any)[key]) {
    console.debug(`%c${key.description}%c is already available in ${globalThis.constructor.name}.`, "color: hsl(10, 83%, 60%)", "color: inherit")
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is now available in ${globalThis.constructor.name}.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

/** Biquad filter coefficient utilities. */
export * from "./biquad-coeff"
/** Biquad filter processors. */
export * from "./biquad-processor"
/** Tempo analysis helpers. */
export * from "./bpm-tools"
/** Chord theory helpers. */
export * from "./chords"
/** Delay line processing. */
export * from "./delay"
/** Time-based event collections. */
export * from "./events"
/** Fast Fourier transform utilities. */
export * from "./fft"
/** Musical fractions and conversions. */
export * from "./fractions"
/** Audio fragment processing. */
export * from "./fragmentor"
/** Directed graphs and topological sorting. */
export * from "./graph"
/** Groove pattern utilities. */
export * from "./grooves"
/** MIDI key naming and scales. */
export * from "./midi-keys"
/** Musical note utilities. */
export * from "./notes"
/** Oscillator implementations. */
export * from "./osc"
/** Pulses-per-quarter-note conversions. */
export * from "./ppqn"
/** Parameter ramping helpers. */
export * from "./ramp"
/** Root-mean-square calculations. */
export * from "./rms"
/** Stereo matrix processing. */
export * from "./stereo"
/** General DSP utilities. */
export * from "./utils"
/** Value manipulation helpers. */
export * from "./value"
/** Windowing functions. */
export * from "./window"