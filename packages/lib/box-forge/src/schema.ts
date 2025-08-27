/**
 * Schema definitions used by {@link BoxForge} to generate strongly-typed box
 * classes. These types describe the shape of boxes, fields and pointer
 * relations in a declarative manner.
 *
 * @see {@link BoxForge.gen} for compiling schemas
 * @see {@link ../../../docs/docs-dev/serialization/box-forge.md | Box forge serialization guide}
 */
import { float, Func, int, Objects } from "@opendaw/lib-std";
import { FieldKey, PointerRules, PointerTypes } from "@opendaw/lib-box";

/**
 * Primitive field types supported by the forge.
 */
export interface PrimitiveTypes {
  int32: int;
  float32: float;
  boolean: boolean;
  string: string;
  bytes: Int8Array;
}

/**
 * Placeholder value used to reserve numeric field keys for future extension.
 *
 * @see reserveMany
 */
export const reserved = Object.freeze({ type: "reserved", name: "" } as const);

type ReservedType = typeof reserved;

/**
 * Creates an object that reserves multiple field keys at once.
 *
 * @param _keys - Field keys to mark as {@link reserved}.
 * @see reserved
 */
export const reserveMany = <Keys extends int[]>(
  ..._keys: Keys
): Record<Keys[int], ReservedType> => ({}) as Record<Keys[int], ReservedType>;

/**
 * Common property carried by every field: its display name.
 */
export type FieldName = {
  name: string;
};
/**
 * Adds optional pointer rules to schema types that can reference other boxes.
 */
export type Referencable<E extends PointerTypes> = {
  pointerRules?: PointerRules<E>;
};
/**
 * Root forge schema supplied to {@link BoxForge.gen}. Describes output paths,
 * pointer enumeration details and the list of boxes to generate.
 */
export type Schema<E extends PointerTypes> = {
  /** Path where generated TypeScript files will be written. */
  path: string;
  /** Pointer enum information used by the generator. */
  pointers: {
    from: string;
    enum: string;
    /** Converts an enum value into TypeScript source. */
    print: Func<E, string>;
  };
  /** Collection of box schemas to forge. */
  boxes: ReadonlyArray<BoxSchema<E>>;
};
/** Mapping of numeric field keys to their corresponding schema definitions. */
export type FieldRecord<E extends PointerTypes> = Record<
  FieldKey,
  AnyField<E> & FieldName
>;
/** Describes a class to be generated, including its name and fields. */
export type ClassSchema<E extends PointerTypes> = {
  name: string;
  fields: FieldRecord<E>;
};
/** Schema wrapper for a top-level box that becomes a generated class. */
export type BoxSchema<E extends PointerTypes> = Referencable<E> & {
  type: "box";
  class: ClassSchema<E>;
};
/** Schema for an object field containing its own class schema. */
export type ObjectSchema<E extends PointerTypes> = {
  type: "object";
  class: ClassSchema<E>;
};
/** Schema for a fixed-length array field. */
export type ArrayFieldSchema<E extends PointerTypes> = {
  type: "array";
  element: AnyField<E>;
  length: int;
};
/** Schema describing a pointer to another box. */
export type PointerFieldSchema<E extends PointerTypes> = {
  type: "pointer";
  pointerType: E;
  mandatory: boolean;
};

/** Schema describing primitive field values such as numbers or strings. */
export type PrimitiveFieldSchema<E extends PointerTypes> = Referencable<E> &
  {
    [K in keyof PrimitiveTypes]: { type: K; value?: PrimitiveTypes[K] };
  }[keyof PrimitiveTypes];

/** Base schema for plain fields with no additional structure. */
export type FieldSchema<E extends PointerTypes> = Required<Referencable<E>> & {
  type: "field";
};
/** Union of every supported field schema type. */
export type AnyField<E extends PointerTypes> =
  | FieldSchema<E>
  | PointerFieldSchema<E>
  | PrimitiveFieldSchema<E>
  | ArrayFieldSchema<E>
  | ObjectSchema<E>
  | typeof reserved;

// utility methods to build schema
//
/**
 * Merge two field records ensuring no key overlap at compile time.
 *
 * @see FieldRecord
 */
export const mergeFields = <
  E extends PointerTypes,
  U extends FieldRecord<E>,
  V extends FieldRecord<E>,
>(
  u: U,
  v: Objects.Disjoint<U, V>,
): U & V => Objects.mergeNoOverlap(u, v);
