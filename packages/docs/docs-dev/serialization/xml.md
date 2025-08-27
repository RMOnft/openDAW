# XML Serialization

`@opendaw/lib-xml` converts decorated classes into XML elements.

```mermaid
graph TD
    Class["TypeScript class"] -->|decorators| Instance[Xml.element]
    Instance --> Element["XML Element"]
    Element --> String["Serialized string"]
```

- See the [package README](../../../lib/xml/README.md) for a full example.
- Return to the [serialization overview](./overview.md).
