# Examples

## Encoding and parsing metadata

```ts
import {Xml} from "@opendaw/lib-xml";
import {MetaDataSchema} from "@opendaw/lib-dawproject";

const xml = Xml.pretty(Xml.toElement("MetaData",
  Xml.element({title: "Demo", artist: "openDAW"}, MetaDataSchema)));
const result = Xml.parse(xml, MetaDataSchema);
```

## Loading a project file

```ts
import exampleXml from "@test-files/bitwig.example.xml?raw";
import {Xml} from "@opendaw/lib-xml";
import {ProjectSchema} from "@opendaw/lib-dawproject";

const project = Xml.parse(exampleXml, ProjectSchema);
console.log(project.structure.length);
```
