# Configuration Overview

The Studio application exposes several modules that centralize runtime configuration:

- `configs.ts` – snapping presets for timeline and level meters.
- `features.ts` – feature detection ensuring required Web APIs before boot.
- `FilePickerAcceptTypes.ts` – lists of accepted file types for the File System Access API.

These modules are exported from `@opendaw/app-studio` and can be imported using path mappings defined in the package metadata:

```ts
import { SnapCenter } from "@opendaw/app-studio/configs";
import { testFeatures } from "@opendaw/app-studio/features";
```

The package `package.json` and `tsconfig.json` reference these files so tooling and
consumers can resolve them directly.
