import { Pointers } from "@opendaw/studio-enums";
import {
  BooleanField,
  Box,
  Int32Field,
  PointerField,
  StringField,
} from "@opendaw/lib-box";
import { isDefined, isInstanceOf, Nullish, panic } from "@opendaw/lib-std";

/**
 * Shared structure of all device boxes consumed by device processors.
 *
 * @example
 * ```ts
 * if (DeviceBoxUtils.isDeviceBox(box)) {
 *   console.log(box.label.getValue())
 * }
 * ```
 *
 * @see {@link @opendaw/studio-core-processors#DeviceProcessorFactory}
 */
export type DeviceBox = {
  /** Pointer to the hosting track or chain. */
  host: PointerField;
  /** User facing name. */
  label: StringField;
  /** Indicates whether the device is active. */
  enabled: BooleanField;
  /** Persisted UI state. */
  minimized: BooleanField;
} & Box;

/**
 * Box describing an instrument device.
 *
 * @example
 * ```ts
 * const host = DeviceBoxUtils.lookupHostField(instrumentBox)
 * ```
 */
export type InstrumentDeviceBox = {
  host: PointerField<Pointers.InstrumentHost>;
} & DeviceBox;

/**
 * Box describing an audio or MIDI effect device.
 *
 * @example
 * ```ts
 * const index = effectBox.index.getValue()
 * ```
 */
export type EffectDeviceBox = {
  host: PointerField<Pointers.AudioEffectHost | Pointers.MidiEffectHost>;
  index: Int32Field;
} & DeviceBox;

/**
 * Helper functions for working with {@link DeviceBox} instances.
 *
 * @example
 * ```ts
 * if (DeviceBoxUtils.isInstrumentDeviceBox(box)) {
 *   // handle instrument device
 * }
 * ```
 */
export namespace DeviceBoxUtils {
  /**
   * Type guard checking whether a box conforms to the {@link DeviceBox} shape.
   *
   * @example
   * ```ts
   * if (DeviceBoxUtils.isDeviceBox(box)) {
   *   // box.host is now typed
   * }
   * ```
   */
  export const isDeviceBox = (box: Box): box is DeviceBox =>
    "host" in box &&
    isInstanceOf(box.host, PointerField) &&
    "label" in box &&
    isInstanceOf(box.label, StringField) &&
    "enabled" in box &&
    isInstanceOf(box.enabled, BooleanField) &&
    "minimized" in box &&
    isInstanceOf(box.minimized, BooleanField);

  /**
   * Type guard narrowing to {@link InstrumentDeviceBox}.
   *
   * @example
   * ```ts
   * if (DeviceBoxUtils.isInstrumentDeviceBox(box)) {
   *   box.host.refer(someTrack)
   * }
   * ```
   */
  export const isInstrumentDeviceBox = (box: Box): box is InstrumentDeviceBox =>
    isDeviceBox(box) && box.host.pointerType === Pointers.InstrumentHost;

  /**
   * Type guard narrowing to {@link EffectDeviceBox}.
   *
   * @example
   * ```ts
   * if (DeviceBoxUtils.isEffectDeviceBox(box)) {
   *   console.log(box.index.getValue())
   * }
   * ```
   */
  export const isEffectDeviceBox = (box: Box): box is EffectDeviceBox =>
    isDeviceBox(box) &&
    "index" in box &&
    isInstanceOf(box.index, Int32Field) &&
    (box.host.pointerType === Pointers.MidiEffectHost ||
      box.host.pointerType === Pointers.AudioEffectHost);

  /**
   * Finds the `host` field on a device box or throws.
   *
   * @example
   * ```ts
   * const host = DeviceBoxUtils.lookupHostField(box)
   * ```
   */
  export const lookupHostField = (box: Nullish<Box>): PointerField =>
    isDefined(box) && "host" in box && isInstanceOf(box.host, PointerField)
      ? box.host
      : panic(`Could not find 'host' field in '${box?.name}'`);
  /**
   * Finds the `label` field on a device box or throws.
   */
  export const lookupLabelField = (box: Nullish<Box>): StringField =>
    isDefined(box) && "label" in box && isInstanceOf(box.label, StringField)
      ? box.label
      : panic(`Could not find 'label' field in '${box?.name}'`);
  /**
   * Finds the `enabled` field on a device box or throws.
   */
  export const lookupEnabledField = (box: Nullish<Box>): BooleanField =>
    isDefined(box) &&
    "enabled" in box &&
    isInstanceOf(box.enabled, BooleanField)
      ? box.enabled
      : panic(`Could not find 'enabled' field in '${box?.name}'`);
  /**
   * Finds the `minimized` field on a device box or throws.
   */
  export const lookupMinimizedField = (box: Nullish<Box>): BooleanField =>
    isDefined(box) &&
    "minimized" in box &&
    isInstanceOf(box.minimized, BooleanField)
      ? box.minimized
      : panic(`Could not find 'minimized' field in '${box?.name}'`);
  /**
   * Finds the `index` field on an effect device box or throws.
   */
  export const lookupIndexField = (box: Nullish<Box>): Int32Field =>
    isDefined(box) && "index" in box && isInstanceOf(box.index, Int32Field)
      ? box.index
      : panic(`Could not find 'index' field in '${box?.name}'`);
}
