_This package is part of the openDAW SDK_

# @opendaw/lib-dawproject

Application agnostic XML Schema for [DAWproject](https://github.com/bitwig/dawproject) files.

The library exposes the default schema definitions in [`src/defaults.ts`](./src/defaults.ts) and a set of
helpers in [`src/utils.ts`](./src/utils.ts) for working with parameters.

These helpers bridge DAWproject parameter units and openDAW's internal
representations. The encoding utilities produce typed XML via
[`@opendaw/lib-xml`](../xml/README.md).

See the [developer documentation](../../docs/docs-dev/dawproject/overview.md) for a detailed overview,
data format description, and additional examples.

## Documentation

- [DAWproject parameter mapping](../../docs/docs-dev/serialization/dawproject.md)
- [Serialization overview](../../docs/docs-dev/serialization/overview.md)

## Test fixtures

Example project files for experimentation live in [`test-files`](../../test-files). A developer overview
of these fixtures is available in the [testing docs](../../docs/docs-dev/testing/test-files.md).
