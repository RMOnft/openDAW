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
 * Effects can be inserted or reached via sends using
 * {@link @opendaw/studio-enums#AudioSendRouting | AudioSendRouting}.
 *
 * @public
 */
export type EffectBox =
    | ArpeggioDeviceBox | PitchDeviceBox | ZeitgeistDeviceBox | UnknownMidiEffectDeviceBox
    | DelayDeviceBox | ReverbDeviceBox | RevampDeviceBox | StereoToolDeviceBox
    | ModularDeviceBox | UnknownAudioEffectDeviceBox

