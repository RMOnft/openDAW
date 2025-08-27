import {IconSymbol} from "@opendaw/studio-adapters"
import {int} from "@opendaw/lib-std"

/**
 * Optional parameters used when creating instrument instances.
 */
export type InstrumentOptions = {
    /** User facing name for the instrument. */
    name?: string,
    /** Icon representing the instrument in the UI. */
    icon?: IconSymbol,
    /** Index determining the instrument's placement in lists. */
    index?: int
}

