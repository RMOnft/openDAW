# Errors

`errors.ts` contains helpers for working with DOM related error conditions
such as wrapping thrown exceptions or normalising browser specific error
messages.

```ts
import { DomError } from "@opendaw/lib-dom";
try {
  // risky operation
} catch (e) {
  throw new DomError("Failed to execute", e);
}
```
