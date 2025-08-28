/**
 * Utilities and constants for pulses per quarter note (PPQN).
 * A single bar in 4/4 time consists of 3,840 pulses where a quarter note equals
 * 960 pulses (3 × 5 × 2^6).
 *
 * @public
 */

import {int} from "@opendaw/lib-std"

/** Musical position expressed in pulses per quarter note. */
export type ppqn = number

/** Pulses contained in one quarter note. */
const Quarter = 960 as const
/** Pulses contained in a 4/4 bar. */
const Bar = Quarter << 2 // 3_840
/** Pulses contained in a semiquaver. */
const SemiQuaver = Quarter >>> 2 // 240
/**
 * Calculates pulses for a time signature.
 *
 * @param nominator - Beats per bar.
 * @param denominator - Note value representing one beat.
 * @returns Total pulses per bar.
 */
const fromSignature = (nominator: int, denominator: int) => Math.floor(Bar / denominator) * nominator
/**
 * Breaks a pulse value down into musical parts.
 *
 * @param ppqn - Pulse count to decompose.
 * @param nominator - Beats per bar.
 * @param denominator - Note value representing one beat.
 * @returns Decomposed musical components.
 */
const toParts = (ppqn: ppqn, nominator: int = 4, denominator: int = 4) => {
    const lowerPulses = fromSignature(1, denominator)
    const beats = Math.floor(ppqn / lowerPulses)
    const bars = Math.floor(beats / nominator)
    const remainingPulses = Math.floor(ppqn) - fromSignature(bars * nominator, denominator)
    const ticks = remainingPulses % lowerPulses
    const semiquavers = Math.floor(ticks / SemiQuaver)
    const remainingTicks = ticks % SemiQuaver
    return {
        bars,
        beats: beats - bars * nominator,
        semiquavers,
        ticks: remainingTicks
    } as const
}

/** Converts seconds to pulses for a given tempo. */
const secondsToPulses = (seconds: number, bpm: number): ppqn => seconds * bpm / 60.0 * Quarter
/** Converts pulses to seconds for a given tempo. */
const pulsesToSeconds = (pulses: ppqn, bpm: number): number => (pulses * 60.0 / Quarter) / bpm
/** Converts sample counts to pulses. */
const samplesToPulses = (samples: number, bpm: number, sampleRate: number): ppqn => secondsToPulses(samples / sampleRate, bpm)
/** Converts pulses to sample counts. */
const pulsesToSamples = (pulses: ppqn, bpm: number, sampleRate: number): number => pulsesToSeconds(pulses, bpm) * sampleRate

/** Utility conversions for {@link ppqn} timing. */
export const PPQN = {
    Bar,
    Quarter,
    SemiQuaver,
    fromSignature,
    toParts,
    secondsToPulses,
    pulsesToSeconds,
    samplesToPulses,
    pulsesToSamples,
    toString: (pulses: ppqn, nominator: int = 4, denominator: int = 4): string => {
        const {bars, beats, semiquavers, ticks} = toParts(pulses | 0, nominator, denominator)
        return `${bars + 1}.${beats + 1}.${semiquavers + 1}:${ticks}`
    }
} as const
