# Plugin Distribution

Plugins can be shared as npm packages or simple static bundles. This guide outlines common
approaches for distributing Studio plugins built with the SDK.

## npm packages

1. Compile the plugin and publish it to the npm registry under a unique name.
2. Consumers install the package and register the plugin with `@opendaw/app-studio`.
3. Provide type definitions and TSDoc comments so the public API is discoverable.

## Static bundles

For lightweight distribution, host the compiled JavaScript and assets on a web server.
Load the bundle at runtime using the plugin registration API.

## Versioning and updates

Follow semantic versioning so hosts can safely upgrade. Document any breaking changes in
your release notes and keep TSDoc comments up to date.

## Further reading

- [Plugin guide](./plugin-guide.md)
- [Testing plugins](./testing-plugins.md)
