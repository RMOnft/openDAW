# Examples

Running the forge writes TypeScript files into a target directory:

```ts
import { BoxForge } from "@opendaw/lib-box-forge";
import schema from "./schema";

await BoxForge.gen(schema);
```

See the test suite for more comprehensive scenarios.
