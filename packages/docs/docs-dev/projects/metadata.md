# Project Metadata

Projects store descriptive information such as the title, tags and optional
notes alongside the serialized graph. The metadata is modeled by
[`ProjectMeta`](../../../app/studio/src/project/ProjectMeta.ts) and persisted as
JSON in `projects/v1/<uuid>/meta.json`.

## Creating Metadata

Use [`ProjectMeta.init`](../../../app/studio/src/project/ProjectMeta.ts) to
instantiate a metadata object with sensible defaults:

```ts
import { ProjectMeta } from "@/project/ProjectMeta";

const meta = ProjectMeta.init("My Song");
```

## Saving and Loading

The [`Projects`](../../../app/studio/src/project/Projects.ts) module handles
writing and reading metadata files when saving or loading sessions. The
`ProjectPaths` helpers construct the file locations.

## Editing in the UI

End users can edit metadata and choose a cover image through the
`ProjectInfo` panel within the studio application. Changes are written to the
metadata file and included when exporting project bundles.

