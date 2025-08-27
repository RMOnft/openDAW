# Standard Library Overview

The `@opendaw/lib-std` package provides a grab bag of utilities used across
openDAW.  Modules are designed to be imported individually and have no
runtime dependencies on the DOM or Node.js APIs.

Key areas covered by the library include:

- Type and language helpers such as `lang.ts` and `option.ts`
- Data structures like `sorted-set.ts` and `multimap.ts`
- Reactive primitives `observables.ts`, `notifier.ts` and friends
- Randomness helpers in `random.ts` and `uuid.ts`

Refer to the package [README](../../../lib/std/README.md) for a full list of
available modules.
