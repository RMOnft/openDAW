import {
    ArpeggioDeviceBox,
    DelayDeviceBox,
    ModularDeviceBox,
    PitchDeviceBox,
    RevampDeviceBox,
    ReverbDeviceBox,
    StereoToolDeviceBox,
    UnknownAudioEffectDeviceBox,
    UnknownMidiEffectDeviceBox,
    ZeitgeistDeviceBox
} from "@opendaw/studio-boxes"

/**
 * Union of all effect device boxes supported by the studio.
 *
 * @public
 */
export type EffectBox =
    | ArpeggioDeviceBox | PitchDeviceBox | ZeitgeistDeviceBox | UnknownMidiEffectDeviceBox
    | DelayDeviceBox | ReverbDeviceBox | RevampDeviceBox | StereoToolDeviceBox
    | ModularDeviceBox | UnknownAudioEffectDeviceBox
