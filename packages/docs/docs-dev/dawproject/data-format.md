# Data Format

DAWproject describes audio projects using XML. The schemas in `src/defaults.ts` reflect the official specification and can
be used with `@opendaw/lib-xml` to serialize or parse project files.

A minimal snippet creating metadata looks like:

```ts
import {Xml} from "@opendaw/lib-xml";
import {MetaDataSchema} from "@opendaw/lib-dawproject";

const xml = Xml.pretty(Xml.toElement("MetaData",
  Xml.element({title: "Demo"}, MetaDataSchema)));
```
