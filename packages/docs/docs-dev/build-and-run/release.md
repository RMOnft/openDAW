# Release

Package releases rely on **Lerna**. The root script `npm run publish-sdk`
executes `lerna publish`, which uses conventional commits to determine version
bumps and publishes packages to npm. Before running the release command, ensure
that:

- `turbo run build` has produced fresh builds.
- `turbo run test` passes for all packages.

Lerna will tag the repository and push the new versions upstream as part of the
publish step. Releases can also be orchestrated by the
[CI pipeline](./ci.md).
