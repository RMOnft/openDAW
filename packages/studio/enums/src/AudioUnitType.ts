/**
 * Categories of audio units supported by the engine.
 *
 * @public
 */
export enum AudioUnitType {
    /** An instrument or generator unit. */
    Instrument = "instrument",
    /** A summing bus used for grouping. */
    Bus = "bus",
    /** An auxiliary send/return unit. */
    Aux = "aux",
    /** The final output unit in the project. */
    Output = "output"
}
