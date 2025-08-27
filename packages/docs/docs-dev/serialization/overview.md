# Serialization Overview

openDAW uses a layered approach to convert structured data into persistent formats.

```mermaid
graph TD
    Boxes["@opendaw/lib-box"] --> Serializer["@opendaw/lib-box Serializer"]
    Serializer --> Binary["Binary data"]
    Boxes --> Xml["@opendaw/lib-xml"]
    Xml --> DAWProject["@opendaw/lib-dawproject"]
    Xml --> MIDI["@opendaw/lib-midi"]
    Boxes --> Forge["@opendaw/lib-box-forge"]
    Forge --> Generated["Generated classes"]
```

- [MIDI serialization](./midi.md)
- [DAWproject mapping](./dawproject.md)
- [XML decorators](./xml.md)
- [Box forge schemas](./box-forge.md)
