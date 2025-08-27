import {NanoDeviceBox, PlayfieldDeviceBox, TapeDeviceBox, VaporisateurDeviceBox} from "@opendaw/studio-boxes"

/**
 * Union of all instrument device boxes available in the studio.
 *
 * @public
 */
export type InstrumentBox = TapeDeviceBox | VaporisateurDeviceBox | NanoDeviceBox | PlayfieldDeviceBox
