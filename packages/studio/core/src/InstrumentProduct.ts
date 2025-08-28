import {AudioUnitBox, TrackBox} from "@opendaw/studio-boxes"
import {InstrumentBox} from "./InstrumentBox"

/**
 * Group of boxes created when instantiating an instrument.
 *
 * @public
 */
export type InstrumentProduct = {
    /** Audio unit used to process sound for the instrument. */
    audioUnitBox: AudioUnitBox
    /** Box containing the instrument's parameters and behaviour. */
    instrumentBox: InstrumentBox
    /** Track box hosting the instrument within the project graph. */
    trackBox: TrackBox
}
