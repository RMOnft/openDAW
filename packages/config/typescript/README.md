# @opendaw/typescript-config

Shared TypeScript configuration presets for openDAW packages.

## Usage

Extend one of the provided presets in your `tsconfig.json`:

```json
{
  "extends": "@opendaw/typescript-config/tsconfig.base.json"
}
```

### Available presets

- `tsconfig.base.json` – minimal baseline options used across the monorepo.
- `tsconfig.build.json` – extends the base preset for compiling packages.
- `tsconfig.eslint.json` – configuration for tooling such as ESLint.
- `vite.json` – settings for Vite powered applications.

Each preset can be customised further in the consuming project.
