# Project System Overview

openDAW stores songs as projects containing a serialized graph, metadata and optional cover image. Files are written beneath the `projects/v1` folder using the helpers from [`ProjectPaths`](../../../app/studio/src/project/Projects.ts).

## Saving

Use [`Projects.saveProject`](../../../app/studio/src/project/Projects.ts) to write a session to disk.

```ts
await Projects.saveProject(session)
```

## Metadata

Project metadata like name and tags is represented by [`ProjectMeta`](../../../app/studio/src/project/ProjectMeta.ts).
