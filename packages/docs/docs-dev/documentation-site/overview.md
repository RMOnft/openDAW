# Documentation Site Overview

The documentation site is built with Docusaurus. Configuration lives in `packages/docs/docusaurus.config.ts` and sidebars are defined in `packages/docs/sidebarsDev.js`, `sidebarsUser.js`, and `sidebarsLearn.js`.

Use the [structure guide](structure.md) for directory layout details, the [styling guide](styling.md) for CSS and component conventions, and the [contributing guide](contributing.md) for contribution instructions.

## API Documentation

API references are generated with [TypeDoc](https://typedoc.org). Each library contains a `typedoc.json` file, and running `./scripts/docs.sh` builds the docs into `packages/docs/api/*`.
