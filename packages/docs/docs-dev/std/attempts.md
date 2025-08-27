# Attempts

The `attempts.ts` module models success or failure outcomes with helper
constructors and pattern matching.

```ts
import { Attempts } from "@opendaw/lib-std/attempts";

const result = Attempts.tryGet(() => JSON.parse("{"));
console.log(result.isFailure());
```
