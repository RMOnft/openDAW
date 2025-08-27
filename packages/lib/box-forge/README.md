# @opendaw/lib-box-forge

Utility for generating strongly typed [Box](../box/README.md) classes from a
declarative schema.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/box-forge/) for detailed reference.

The forge consumes schemas that mirror the
[TypeScript definitions](./src/schema.ts) and emits complete class
implementations. For an overview of how schemas map to generated code, see the
[serialization guide](../../docs/docs-dev/serialization/box-forge.md).

## Features

- Describe boxes, fields and pointer relationships in plain TypeScript objects.
- Compile schemas into TypeScript source files with visitors and I/O helpers.
- Ensures consistent field keys and pointer rules across boxes.

## Basic Usage

```ts
import { BoxForge } from "@opendaw/lib-box-forge";
import { PointerType } from "./Pointers";

BoxForge.gen({
  path: "./gen",
  pointers: {
    from: "./Pointers",
    enum: "PointerType",
    print: (p) => `PointerType.${PointerType[p]}`,
  },
  boxes: [],
});
```

See the developer documentation under `packages/docs/docs-dev/box-forge` for more details.

## Documentation

- [Box forge mapping](../../docs/docs-dev/serialization/box-forge.md)
- [Serialization overview](../../docs/docs-dev/serialization/overview.md)
