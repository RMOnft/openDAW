/**
 * Example usage of the shared ESLint config:
 *
 * ```js
 * // .eslintrc.cjs
 * module.exports = {
 *   root: true,
 *   extends: ['@opendaw/eslint-config'],
 *   parserOptions: {
 *     project: true,
 *   }, // optional for TypeScript projects
 * };
 * ```
 *
 * This file lints the config package itself and demonstrates how to consume
 * the configuration.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.cjs"],
  extends: ["@opendaw/eslint-config"],
};
