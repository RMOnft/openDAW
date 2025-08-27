import {Pointers} from "@opendaw/studio-enums"
import {BooleanField, Box, Int32Field, PointerField, StringField} from "@opendaw/lib-box"
import {isDefined, isInstanceOf, Nullish, panic} from "@opendaw/lib-std"

/**
 * Shared structure of all device boxes consumed by device processors.
 *
 * @see {@link @opendaw/studio-core-processors#DeviceProcessorFactory}
 */
export type DeviceBox = {
    /** Pointer to the hosting track or chain. */
    host: PointerField
    /** User facing name. */
    label: StringField
    /** Indicates whether the device is active. */
    enabled: BooleanField
    /** Persisted UI state. */
    minimized: BooleanField
} & Box

/** Box describing an instrument device. */
export type InstrumentDeviceBox = {
    host: PointerField<Pointers.InstrumentHost>
} & DeviceBox

/** Box describing an audio or MIDI effect device. */
export type EffectDeviceBox = {
    host: PointerField<Pointers.AudioEffectHost | Pointers.MidiEffectHost>
    index: Int32Field
} & DeviceBox

/** Helper functions for working with {@link DeviceBox} instances. */
export namespace DeviceBoxUtils {
    export const isDeviceBox = (box: Box): box is DeviceBox =>
        "host" in box && isInstanceOf(box.host, PointerField) &&
        "label" in box && isInstanceOf(box.label, StringField) &&
        "enabled" in box && isInstanceOf(box.enabled, BooleanField) &&
        "minimized" in box && isInstanceOf(box.minimized, BooleanField)

    export const isInstrumentDeviceBox = (box: Box): box is InstrumentDeviceBox =>
        isDeviceBox(box) && box.host.pointerType === Pointers.InstrumentHost

    export const isEffectDeviceBox = (box: Box): box is EffectDeviceBox =>
        isDeviceBox(box) && "index" in box && isInstanceOf(box.index, Int32Field) &&
        (box.host.pointerType === Pointers.MidiEffectHost || box.host.pointerType === Pointers.AudioEffectHost)

    export const lookupHostField = (box: Nullish<Box>): PointerField =>
        isDefined(box) && "host" in box && isInstanceOf(box.host, PointerField)
            ? box.host : panic(`Could not find 'host' field in '${box?.name}'`)
    export const lookupLabelField = (box: Nullish<Box>): StringField =>
        isDefined(box) && "label" in box && isInstanceOf(box.label, StringField)
            ? box.label : panic(`Could not find 'label' field in '${box?.name}'`)
    export const lookupEnabledField = (box: Nullish<Box>): BooleanField =>
        isDefined(box) && "enabled" in box && isInstanceOf(box.enabled, BooleanField)
            ? box.enabled : panic(`Could not find 'enabled' field in '${box?.name}'`)
    export const lookupMinimizedField = (box: Nullish<Box>): BooleanField =>
        isDefined(box) && "minimized" in box && isInstanceOf(box.minimized, BooleanField)
            ? box.minimized : panic(`Could not find 'minimized' field in '${box?.name}'`)
    export const lookupIndexField = (box: Nullish<Box>): Int32Field =>
        isDefined(box) && "index" in box && isInstanceOf(box.index, Int32Field)
            ? box.index : panic(`Could not find 'index' field in '${box?.name}'`)
}
