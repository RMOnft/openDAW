import {IconSymbol, TrackType} from "@opendaw/studio-adapters"
import {BoxGraph, Field} from "@opendaw/lib-box"

import {InstrumentBox} from "./InstrumentBox"
import {Pointers} from "@opendaw/studio-enums"

/**
 * Factory description for creating instrument device boxes.
 *
 * @public
 */
export interface InstrumentFactory {
    /** Default display name. */
    defaultName: string
    /** Default icon for the instrument. */
    defaultIcon: IconSymbol
    /** Short description used in UI. */
    description: string
    /** Track type the instrument operates on. */
    trackType: TrackType
    /**
     * Creates the instrument within a {@link BoxGraph} and connects it to its host.
     */
    create: (boxGraph: BoxGraph,
             host: Field<Pointers.InstrumentHost | Pointers.AudioOutput>,
             name: string,
             icon: IconSymbol) => InstrumentBox
}
