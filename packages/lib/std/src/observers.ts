/**
 * Observation callback utilities.
 * @packageDocumentation
 */
import {Procedure} from "./lang"

/** Callback invoked when an {@link Observable} emits a value. */
export type Observer<VALUE> = Procedure<VALUE>
