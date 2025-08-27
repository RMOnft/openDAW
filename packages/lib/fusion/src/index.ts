/**
 * @packageDocumentation
 * Entry point for the Fusion utilities.
 *
 * Fusion exposes several messaging channels and protocol contracts that allow
 * workers and the main thread to collaborate:
 *
 * - {@link LiveStreamBroadcaster} and {@link LiveStreamReceiver} exchange audio
 *   frames over a dedicated message channel.
 * - The {@link SamplePeakWorker} communicates with the main thread using the
 *   {@link SamplePeakProtocol} to generate and transfer waveform peak data.
 * - {@link OpfsWorker} implements file system access backed by the
 *   {@link OpfsProtocol}.
 */
const key = Symbol.for("@openDAW/lib-fusion")

if ((globalThis as any)[key]) {
    console.debug(`%c${key.description}%c is already available in ${globalThis.constructor.name}.`, "color: hsl(10, 83%, 60%)", "color: inherit")
} else {
    (globalThis as any)[key] = true
    console.debug(`%c${key.description}%c is now available in ${globalThis.constructor.name}.`, "color: hsl(200, 83%, 60%)", "color: inherit")
}

import './types'

/** Receives audio frames from a {@link LiveStreamBroadcaster} channel. */
export * from "./live-stream/LiveStreamReceiver"
/** Broadcasts audio frames to connected {@link LiveStreamReceiver} instances. */
export * from "./live-stream/LiveStreamBroadcaster"
/** Utilities for managing waveform peaks. */
export * from "./peaks/Peaks"
/** Web Worker that implements the {@link SamplePeakProtocol}. */
export * from "./peaks/SamplePeakWorker"
/** Contract describing messages exchanged to compute audio peaks. */
export * from "./peaks/SamplePeakProtocol"
/** Renders peak data onto a canvas. */
export * from "./peaks/PeaksPainter"
/** Worker providing file system access using the {@link OpfsProtocol}. */
export * from "./opfs/OpfsWorker"
/** Messaging contract for OPFS operations. */
export * from "./opfs/OpfsProtocol"
