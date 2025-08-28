/**
 * Interface describing factories that construct {@link EffectBox} instances
 * and their associated metadata for menus and device lists.
 *
 * @packageDocumentation
 */
import {EffectPointerType, IconSymbol} from "@opendaw/studio-adapters"
import {Field} from "@opendaw/lib-box"
import {int} from "@opendaw/lib-std"
import {Project} from "./Project"
import {EffectBox} from "./EffectBox"

export interface EffectFactory {
    /** Default human readable name. */
    get defaultName(): string
    /** Icon symbol used in the UI. */
    get defaultIcon(): IconSymbol
    /** Short description of the effect. */
    get description(): string
    /** Whether a separator should precede the effect in menus. */
    get separatorBefore(): boolean
    /** Indicates if the effect operates on audio or MIDI data. */
    get type(): "audio" | "midi"

    /**
     * Creates the effect's box and attaches it to the project.
     *
     * @param project - Project context for creating boxes.
     * @param unit - Field referencing the host audio unit.
     * @param index - Insert index within the unit's effect chain.
     * @returns The newly created effect box.
     */
    create(project: Project, unit: Field<EffectPointerType>, index: int): EffectBox
}

