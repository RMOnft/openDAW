# Box Forge Mapping

`@opendaw/lib-box-forge` compiles schema definitions into concrete box classes.

```mermaid
graph TD
    Schema["Schema definition"] --> Forge[BoxForge.gen]
    Forge --> Classes["Generated box classes"]
    Classes --> Serializer["@opendaw/lib-box Serializer"]
```

- See the [package README](../../../lib/box-forge/README.md) for more information.
- Return to the [serialization overview](./overview.md).
