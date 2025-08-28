# Developer Docs

The developer documentation provides guidance for contributing to openDAW's
packages such as [`@opendaw/app-studio`](./package-inventory.md#app). Learn how
to [build and run](./build-and-run/setup.md) the project, explore its
[architecture](./architecture/overview.md), and ensure quality with
[testing and QA](./testing-and-qa/index.md). See the
[project roadmap](../../../ROADMAP.md) for current milestones.

For writing and formatting conventions, see the [Writing Guide](./style/writing-guide.md).

## Table of Contents

- [Build and Run](./build-and-run/setup.md)
- [Tests](./build-and-run/tests.md)
- [Profiling](./build-and-run/profiling.md)
- [Architecture](./architecture/overview.md)
- [Audio Path](./architecture/audio-path.md)
- [Browser Support](./browser-support.md)
- [Package Inventory](./package-inventory.md)
- [API Coverage](./api-coverage.md)
- [Performance](./performance.md)
- [Extending](./extending/opendaw-sdk.md)
- [Contributing](./contributing.md)
- [Licensing](./licensing.md)

## Development Commands

Run the following from the repository root:

```bash
npm run install:deps
npm install
npm run build
npm test
npm run docs:dev    # local docs preview
npm run docs:build  # static docs output
```
