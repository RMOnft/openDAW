/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.js"],
  extends: ["@opendaw/eslint-config"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
  },
};
