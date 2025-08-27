# Monorepo

openDAW is organized as a monorepo so packages share a single repository and
build pipeline. **Turbo** runs tasks such as builds, tests, and linting across
packages, caching results for faster iterations. **Lerna** tracks package
versions and can publish updates from the workspace. Typical commands include:

- `turbo run build` – build all packages.
- `turbo run test` – execute tests.
- `npm run publish-sdk` – invoke `lerna publish` to release packages.

This structure keeps development cohesive while allowing packages to evolve
independently. See [repository configuration](./repo-config.md) for details on
the root config files that support this workflow.
