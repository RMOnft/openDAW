# Monorepo

openDAW is organized as a monorepo so packages share a single repository and
build pipeline. **Turbo** runs tasks such as builds, tests, and linting across
packages, caching results for faster iterations. **Lerna** tracks package
versions and can publish updates from the workspace. Typical commands include:

- `npm run install:deps` – install required system tools.
- `npm install` – install workspace packages.
- `turbo run build` – build all packages.
- `turbo run test` – execute tests.
- `npm run docs:dev` or `npm run docs:build` – generate documentation.
- `npm run publish-sdk` – invoke `lerna publish` to release packages.

This structure keeps development cohesive while allowing packages to evolve
independently. See [repository configuration](./repo-config.md) for details on
the root config files that support this workflow.
