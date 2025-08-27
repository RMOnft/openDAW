import {clamp, int, PI_QUART} from "@opendaw/lib-std"

/**
 * Utilities for manipulating stereo audio using simple matrix operations.
 *
 * The stereo matrix applies a transform of the form
 * \( [L'\;R'] = M \cdot [L\;R] \) where `M` contains per–channel gains.
 */
export namespace StereoMatrix {
    export type Matrix = {
        ll: number // L -> L
        rl: number // R -> L
        lr: number // L -> R
        rr: number // R -> R
    }
    export type Params = {
        gain: number
        panning: number   // -1 (left) to +1 (right)
        stereo: number      // -1 (mono) to 0 (neutral) to +1 (increased width)
        invertL: boolean
        invertR: boolean
        swap: boolean
    }

    export enum Mixing {Linear, EqualPower}

    export type Channels = [Float32Array, Float32Array]

    /**
     * Creates a matrix filled with zeros.
     */
    export const zero = (): Matrix => ({ll: 0.0, lr: 0.0, rl: 0.0, rr: 0.0})

    /**
     * Creates an identity matrix that leaves the signal unchanged.
     */
    export const identity = (): Matrix => ({ll: 1.0, lr: 0.0, rl: 0.0, rr: 1.0})

    /**
     * Updates a matrix in-place according to the supplied parameters.
     *
     * @param m - Matrix to mutate.
     * @param param1 - Mixing parameters.
     * @param param2 - Panning law to apply.
     */
    export const update = (m: Matrix,
                           {gain, panning, invertL, invertR, stereo, swap}: Params,
                           mixing: Mixing = Mixing.EqualPower): void => {
        const [panL, panR] = panningToGains(panning, mixing)
        let lGain = panL * gain
        let rGain = panR * gain
        if (invertL) lGain *= -1.0
        if (invertR) rGain *= -1.0
        const mono = Math.max(0.0, -stereo)
        const expand = Math.max(0.0, stereo)
        const midGain = 1.0 - expand
        const sideGain = 1.0 + expand
        const monoAmount = mono * 0.5
        const stereoWidth = 1.0 - mono
        const m00 = (midGain + sideGain) * 0.5
        const m01 = (midGain - sideGain) * 0.5
        const m10 = (midGain - sideGain) * 0.5
        const m11 = (midGain + sideGain) * 0.5
        const ll = (lGain * (monoAmount + stereoWidth)) * m00 + (rGain * monoAmount) * m01
        const rl = (lGain * (monoAmount + stereoWidth)) * m10 + (rGain * monoAmount) * m11
        const lr = (lGain * monoAmount) * m00 + (rGain * (monoAmount + stereoWidth)) * m01
        const rr = (lGain * monoAmount) * m10 + (rGain * (monoAmount + stereoWidth)) * m11
        if (swap) {
            m.ll = rl
            m.rl = ll
            m.lr = rr
            m.rr = lr
        } else {
            m.ll = ll
            m.lr = lr
            m.rl = rl
            m.rr = rr
        }
    }

    /**
     * Converts a panning value into left/right gains.
     *
     * For equal-power mixing the gains follow
     * \(L = \cos((x+1)\pi/4)\) and \(R = \sin((x+1)\pi/4)\).
     *
     * @param panning - Position in the stereo field `[-1,1]`.
     * @param mixing - Linear or equal-power law.
     */
    export const panningToGains = (panning: number, mixing: Mixing): [number, number] => {
        const x = clamp(panning, -1.0, 1.0)
        switch (mixing) {
            case Mixing.Linear:
                return [
                    Math.min(1.0 - x, 1.0),
                    Math.min(x + 1.0, 1.0)
                ]
            case Mixing.EqualPower:
                return [
                    Math.cos((x + 1.0) * PI_QUART),
                    Math.sin((x + 1.0) * PI_QUART)
                ]
        }
    }

    /**
     * Applies the matrix to a single stereo frame.
     * @param m - Matrix to apply.
     * @param l - Left sample.
     * @param r - Right sample.
     * @returns Transformed `[left,right]` frame.
     */
    export const applyFrame = (m: Matrix, l: number, r: number): [number, number] =>
        [m.ll * l + m.rl * r, m.lr * l + m.rr * r]

    /**
     * Processes a range of frames and writes the result into `target`.
     *
     * @param m - Transformation matrix.
     * @param source - Source stereo channels.
     * @param target - Destination stereo channels.
     * @param fromIndex - Start index (inclusive).
     * @param toIndex - End index (exclusive).
     */
    export const processFrames = (m: Matrix,
                                  source: Channels, target: Channels,
                                  fromIndex: int, toIndex: int): void => {
        const [src0, src1] = source
        const [trg0, trg1] = target
        for (let i = fromIndex; i < toIndex; i++) {
            const l = src0[i]
            const r = src1[i]
            trg0[i] = m.ll * l + m.rl * r
            trg1[i] = m.lr * l + m.rr * r
        }
    }

    /**
     * Replaces a range of frames in-place using the matrix.
     *
     * @param m - Matrix to apply.
     * @param param1 - Channels to transform.
     * @param fromIndex - Start frame.
     * @param toIndex - End frame (exclusive).
     */
    export const replaceFrames = (m: Matrix, [ch0, ch1]: Channels, fromIndex: int, toIndex: int): void => {
        for (let i = fromIndex; i < toIndex; i++) {
            const l = ch0[i]
            const r = ch1[i]
            ch0[i] = m.ll * l + m.rl * r
            ch1[i] = m.lr * l + m.rr * r
        }
    }
}