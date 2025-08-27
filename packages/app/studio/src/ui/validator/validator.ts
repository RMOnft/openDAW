import { Exec, Procedure } from "@opendaw/lib-std";

/**
 * Result handlers passed to a {@link Validator}.
 *
 * @template T The value type.
 * @example
 * ```ts
 * const result: Result<string> = {
 *   success: value => console.log(value),
 *   failure: () => console.error("Invalid value")
 * }
 * ```
 */
export interface Result<T> {
  success: Procedure<T>;
  failure?: Exec;
}

/**
 * Validates a value and triggers matching result handlers.
 *
 * @template T The type of value to validate.
 * @example
 * ```ts
 * const notEmpty: Validator<string> = {
 *   validate: (value, match) => {
 *     if (value) {
 *       match.success(value)
 *     } else {
 *       match.failure?.()
 *     }
 *   }
 * }
 * ```
 */
export interface Validator<T> {
  validate: (value: T, match: Result<T>, origin?: Element) => void;
}
