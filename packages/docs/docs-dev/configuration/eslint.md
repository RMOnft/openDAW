# ESLint

openDAW ships a shared ESLint configuration published as
`@opendaw/eslint-config`.

## Usage

Install the required packages:

```bash
npm install -D eslint @opendaw/eslint-config \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-config-prettier
```

Create an `.eslintrc.cjs`:

```js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@opendaw/eslint-config"],
  parserOptions: { project: true }, // optional for TypeScript projects
};
```

The config forbids direct imports from `src` folders. Use package exports
instead.
