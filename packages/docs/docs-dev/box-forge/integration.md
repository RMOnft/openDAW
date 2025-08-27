# Integration

Generated boxes behave like any other `@opendaw/lib-box` class. After forging, import
them and interact with a `BoxGraph`:

```ts
import { BoxGraph } from "@opendaw/lib-box";
import { DrumBox } from "./gen";

const graph = new BoxGraph();
const drum = DrumBox.create(graph, UUID.generate());
drum.gain.setValue(0.5);
```
