/**
 * Number of audio frames processed per Web Audio render quantum.
 *
 * The Web Audio API fixes the {@link AudioWorklet} block size to 128 samples.
 * Using a bitwise OR coerces the number into an {@link int}.
 */
export const RenderQuantum = 128 | 0
