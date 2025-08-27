# Decorators

The `decorators.ts` module offers lightweight TypeScript decorators such as
`Lazy` for memoizing getter results.

```ts
import { Lazy } from "@opendaw/lib-std/decorators";

class Demo {
  @Lazy
  get value() {
    return Math.random();
  }
}
```
