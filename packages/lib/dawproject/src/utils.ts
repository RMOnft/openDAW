/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @packageDocumentation
 * Utility helpers for encoding and decoding parameter schemas used in DAWproject.
 */
import { BooleanParameterSchema, RealParameterSchema, Unit } from "./defaults";
import { Xml } from "@opendaw/lib-xml";
import { asDefined } from "@opendaw/lib-std";
import { semitoneToHz } from "@opendaw/lib-dsp";

/**
 * Helper functions for encoding DAWproject parameter values.
 *
 * @see {@link ParameterDecoder} for reading values back
 * @see {@link ../../../docs/docs-dev/serialization/dawproject.md | DAWproject serialization guide}
 */
export namespace ParameterEncoder {
  /**
   * Encodes a boolean parameter.
   *
   * @param id - Unique parameter identifier.
   * @param value - Boolean value to store.
   * @param name - Optional display name.
   * @returns Serialized {@link BooleanParameterSchema} instance.
   */
  export const bool = (id: string, value: boolean, name?: string) =>
    Xml.element(
      {
        id,
        name,
        value,
      },
      BooleanParameterSchema,
    );

  /**
   * Encodes a linear numeric parameter.
   *
   * @param id - Unique parameter identifier.
   * @param value - Linear value to encode.
   * @param min - Optional minimum value.
   * @param max - Optional maximum value.
   * @param name - Optional display name.
   * @returns Serialized {@link RealParameterSchema} instance.
   */
  export const linear = (
    id: string,
    value: number,
    min?: number,
    max?: number,
    name?: string,
  ) =>
    Xml.element(
      {
        id,
        name,
        min,
        max,
        value,
        unit: Unit.LINEAR,
      },
      RealParameterSchema,
    );

  /**
   * Encodes a normalized numeric parameter.
   *
   * @param id - Unique parameter identifier.
   * @param value - Normalized value within the range `[min,max]`.
   * @param min - Minimum value of the normalized range.
   * @param max - Maximum value of the normalized range.
   * @param name - Optional display name.
   * @returns Serialized {@link RealParameterSchema} instance.
   */
  export const normalized = (
    id: string,
    value: number,
    min?: number,
    max?: number,
    name?: string,
  ) =>
    Xml.element(
      {
        id,
        name,
        min,
        max,
        value,
        unit: Unit.NORMALIZED,
      },
      RealParameterSchema,
    );
}

/**
 * Functions for reading values from parameter schemas.
 *
 * @see {@link ParameterEncoder} for writing values
 */
export namespace ParameterDecoder {
  /**
   * Resolves the numeric value from a {@link RealParameterSchema}.
   *
   * @param schema - Parameter schema to interpret.
   * @returns Linearized numeric value.
   *
   * @remarks
   * Normalized and semitone based parameters are converted to linear values.
   */
  export const readValue = (schema: RealParameterSchema): number => {
    if (schema.unit === Unit.LINEAR) {
      return schema.value;
    } else if (schema.unit === Unit.NORMALIZED) {
      const min = asDefined(schema.min);
      const max = asDefined(schema.max);
      return (schema.value - min) / (max - min);
    } else if (schema.unit === Unit.SEMITONES) {
      return semitoneToHz(schema.value);
    }
    return schema.value;
  };
}
