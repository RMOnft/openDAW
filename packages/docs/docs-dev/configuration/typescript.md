# TypeScript Configuration

The `@opendaw/typescript-config` package provides shared `tsconfig` presets used
throughout the project.

## Basic usage

Extend one of the presets from your project's `tsconfig.json`:

```json
{
  "extends": "@opendaw/typescript-config/tsconfig.base.json"
}
```

### Presets

- **tsconfig.base.json** – baseline compiler options.
- **tsconfig.build.json** – build oriented options for libraries and scripts.
- **tsconfig.eslint.json** – configuration used by ESLint and other tools.
- **vite.json** – settings tailored for Vite applications.

Each preset can be further customised as needed.
