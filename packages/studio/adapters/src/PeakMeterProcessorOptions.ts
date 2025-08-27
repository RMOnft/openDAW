import {int} from "@opendaw/lib-std"

/**
 * Options for the {@link @opendaw/studio-core-processors#MeterProcessor | peak meter processor}.
 *
 * @remarks
 * The processor writes level information into the supplied `SharedArrayBuffer`.
 * Adapters mirror that state on the main thread to visualise signal peaks and
 * RMS levels.
 */
export interface PeakMeterProcessorOptions {
    /** Shared buffer used to exchange metering data. */
    sab: SharedArrayBuffer
    /** Number of channels the meter processes. */
    numberOfChannels: int
    /** Window size for RMS calculation. */
    rmsWindowInSeconds: number
    /** Decay factor applied to peak values. */
    valueDecay: number
}
