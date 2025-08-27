# Working with Sessions

A `ProjectSession` combines a project, its metadata and runtime state. It exposes helpers for saving and updating metadata.

```ts
const session = new ProjectSession(service, uuid, project, meta, Option.None, true)
await session.save()
```

Use `saveAs` to duplicate the project under a new identifier and metadata.
