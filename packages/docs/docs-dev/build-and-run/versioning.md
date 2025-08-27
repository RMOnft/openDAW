# Versioning

openDAW uses **Lerna** to manage versions for all workspace packages. Each
package manifest includes a `version` field with an accompanying `version//`
comment pointing back to this policy. The root `package.json`, `lerna.json`,
and `turbo.json` also include inline comments referencing this document to make
version responsibilities explicit.

- Do not edit version numbers manually. Run `npm run publish-sdk` to bump and
  publish packages.
- Packages use independent semantic versions. The root manifest and other
  private packages stay at `0.0.0` to avoid accidental releases.

See the [release guide](./release.md) for publishing steps.
