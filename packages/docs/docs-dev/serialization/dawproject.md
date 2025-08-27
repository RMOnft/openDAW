# DAWproject Mapping

`@opendaw/lib-dawproject` bridges openDAW's types to the DAWproject XML schema.

```mermaid
graph TD
    Encoder[ParameterEncoder] --> Xml["@opendaw/lib-xml"]
    Xml --> File[DAWproject XML]
    File --> Decoder[ParameterDecoder]
```

- See the [package README](../../../lib/dawproject/README.md) for usage details.
- Return to the [serialization overview](./overview.md).
