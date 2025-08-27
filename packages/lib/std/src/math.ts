// noinspection JSUnusedGlobalSymbols

import {int, unitValue} from "./lang"

/** Two times π. */
export const TAU = Math.PI * 2.0
/** Half of π. */
export const PI_HALF = Math.PI / 2.0
/** Quarter of π. */
export const PI_QUART = Math.PI / 4.0
/** 1 / √2 constant. */
export const INVERSE_SQRT_2 = 1.0 / Math.sqrt(2.0)

/** Clamps {@link value} between {@link min} and {@link max}. */
export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(value, max))
/** Clamps {@link value} to the [0,1] range. */
export const clampUnit = (value: number): unitValue => Math.max(0.0, Math.min(value, 1.0))
/** Clamps {@link value} and adds a margin on both sides. */
export const squashUnit = (value: unitValue, margin: unitValue): unitValue =>
    margin + (1.0 - 2.0 * margin) * Math.max(0.0, Math.min(value, 1.0))
/** Quantizes {@link value} downwards to the nearest {@link interval}. */
export const quantizeFloor = (value: number, interval: number): number => Math.floor(value / interval) * interval
/** Quantizes {@link value} upwards to the nearest {@link interval}. */
export const quantizeCeil = (value: number, interval: number): number => Math.ceil(value / interval) * interval
/** Quantizes {@link value} to the nearest {@link interval}. */
export const quantizeRound = (value: number, interval: number): number => Math.round(value / interval) * interval
/** Linear interpolation. */
export const linear = (y1: number, y2: number, mu: number): number => y1 + (y2 - y1) * mu
/** Cosine interpolation between {@link y1} and {@link y2}. */
export const cosine = (y1: number, y2: number, mu: number): number => {
    const mu2 = (1.0 - Math.cos(mu * Math.PI)) * 0.5
    return y1 * (1.0 - mu2) + y2 * mu2
}
/** Modulo that always yields a positive result. */
export const mod = (value: number, range: number): number => fract(value / range) * range
/** Fractional part of {@link value}. */
export const fract = (value: number): number => value - Math.floor(value)
/** Next power of two for {@link n}. */
export const nextPowOf2 = (n: int): int => Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)))
/** Converts radians to degrees. */
export const radToDeg = (rad: number): number => rad * 180.0 / Math.PI
/** Converts degrees to radians. */
export const degToRad = (deg: number): number => deg / 180.0 * Math.PI

// Möbius-Ease Curve
// Only produces valid values between 0 and 1 (unitValues)
// https://www.desmos.com/calculator/ht8cytaxsz
// The inverse is h`=1-h
/**
 * Möbius easing function parameterised by `h`.
 */
export const moebiusEase = (x: unitValue, h: unitValue): unitValue => (x * h) / ((2.0 * h - 1.0) * (x - 1.0) + h)
