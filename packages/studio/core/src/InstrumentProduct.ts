import {AudioUnitBox, TrackBox} from "@opendaw/studio-boxes"
import {InstrumentBox} from "./InstrumentBox"

/**
 * Group of boxes created when instantiating an instrument.
 *
 * @public
 */
export type InstrumentProduct = {
    audioUnitBox: AudioUnitBox
    instrumentBox: InstrumentBox
    trackBox: TrackBox
}
