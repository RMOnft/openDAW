/** @type {import("eslint").Linter.Config} */
// ESLint governs code quality rules across the repository
module.exports = {
  root: true, // treat this file as the root ESLint config
  ignorePatterns: [".eslintrc.js"], // don't lint the config itself
  extends: ["@opendaw/eslint-config"], // share common lint rules
  rules: {
    "@typescript-eslint/no-namespace": "off", // allow namespaces for legacy modules
  },
};
