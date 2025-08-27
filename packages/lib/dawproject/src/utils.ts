/* eslint-disable @typescript-eslint/no-namespace */
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
   * @see {@link BooleanParameterSchema}
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
   * @see {@link RealParameterSchema}
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
   * @see {@link RealParameterSchema}
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
