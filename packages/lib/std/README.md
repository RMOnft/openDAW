_This package is part of the openDAW SDK_

# @opendaw/lib-std

A lightweight standard library offering foundational utilities, algorithms and
data structures for TypeScript projects. Each file listed below can be imported
individually.

## Developer Guides

For in-depth discussions and usage examples, see the developer documentation:

- [Standard Library Overview](../../docs/docs-dev/std/overview.md)
- [Collections](../../docs/docs-dev/std/collections.md)
- [Observers & Reactivity](../../docs/docs-dev/std/observers.md)
- [Randomness Utilities](../../docs/docs-dev/std/randomness.md)

## API Docs

See the [API documentation](https://opendaw.org/docs/api/std/) for detailed reference.

## Core Utilities

- Language primitives, type definitions, and utility functions **lang.ts**

  ```ts
  import { clamp } from "@opendaw/lib-std/lang";

  clamp(10, 0, 5); // 5
  ```

- Optional values with monadic operations **option.ts**
- UUID generation, parsing, and manipulation **uuid.ts**
- Array utilities and operations **arrays.ts**
- Object manipulation and utility functions **objects.ts**
- String processing and utilities **strings.ts**
- Mathematical operations and utilities **math.ts**
- Numeric type handling and operations **numeric.ts**

  ```ts
  import { Integer } from "@opendaw/lib-std/numeric";

  Integer.toByte(260); // 4
  ```

## Data Structures

- Ordered set with custom key extraction and comparison **sorted-set.ts**
- Multi-value map implementation **multimap.ts**
- Bidirectional mapping data structure **bijective.ts**

  ```ts
  import type { Bijective } from "@opendaw/lib-std/bijective";

  const numberString: Bijective<number, string> = {
    fx: (n) => n.toString(),
    fy: (s) => parseInt(s, 10),
  };
  ```

- Caching mechanisms **cache.ts**
- Map utilities and extensions **maps.ts**
- Set utilities and operations **sets.ts**

  ```ts
  import { Sets } from "@opendaw/lib-std/sets";

  const empty = Sets.empty<number>();
  ```

## Algorithms & Search

- Binary search implementations **binary-search.ts**
- Comparison function utilities **comparators.ts**
- Hashing utilities **hash.ts**
- Predicate functions and utilities **predicates.ts**

  ```ts
  import { Predicates } from "@opendaw/lib-std/predicates";

  Predicates.alwaysTrue(123); // true
  ```

## Data Processing

- Data input/output operations **data.ts**

  ```ts
  import { ByteArrayOutput, ByteArrayInput } from "@opendaw/lib-std/data";

  const out = ByteArrayOutput.create();
  out.writeInt(42);
  const input = ByteArrayInput.use(out.buffer);
  input.readInt(); // 42
  ```

- Schema validation and utilities **schema.ts**

  ```ts
  import { Schema } from "@opendaw/lib-std/schema";

  const builder = Schema.createBuilder({ value: Schema.int8 });
  const io = builder();
  io.object.value = 7;
  ```

- Cryptographic utilities **crypto.ts**
- Bit manipulation operations **bits.ts**

  ```ts
  import { Bits } from "@opendaw/lib-std/bits";

  const bits = new Bits(8);
  bits.setBit(2, true);
  bits.getBit(2); // true
  ```

## Collections & Iteration

- Iterable utilities and operations **iterables.ts**

  ```ts
  import { Iterables } from "@opendaw/lib-std/iterables";

  Iterables.count([1, 2, 3]); // 3
  ```

- Generator functions and utilities **generators.ts**

  ```ts
  import { Generators } from "@opendaw/lib-std/generators";

  const gen = Generators.flatten([1, 2], [3]);
  [...gen]; // [1, 2, 3]
  ```

- Interval operations and utilities **intervals.ts**

  ```ts
  import { Intervals } from "@opendaw/lib-std/intervals";

  Intervals.intersect1D(0, 5, 3, 10); // true
  ```

- Range implementations **range.ts**

  ```ts
  import { Range } from "@opendaw/lib-std/range";

  const r = new Range();
  r.moveTo(0.5);
  ```

- Selection utilities **selection.ts**

## Async & Reactive

- Observer pattern implementations **observers.ts**
- Event listener utilities **listeners.ts**

  ```ts
  import { Listeners } from "@opendaw/lib-std/listeners";

  const l = new Listeners<{ ping(): void }>();
  l.subscribe({ ping: () => console.log("pong") });
  l.proxy.ping();
  ```

- Terminable resource management **terminable.ts**
- Synchronous stream operations **sync-stream.ts**

  ```ts
  import { Schema } from "@opendaw/lib-std/schema";
  import { SyncStream } from "@opendaw/lib-std/sync-stream";

  const builder = Schema.createBuilder({ value: Schema.int8 });
  const io = builder();
  const reader = SyncStream.reader(io, (d) => console.log(d.value));
  const writer = SyncStream.writer(io, reader.buffer, (d) => (d.value = 7));
  writer.tryWrite();
  reader.tryRead();
  ```

- Retry and attempt utilities **attempts.ts**

  ```ts
  import { Attempts } from "@opendaw/lib-std/attempts";

  Attempts.tryGet(() => JSON.parse("{")); // failure
  ```

## Specialized

- Geometric operations and utilities **geom.ts**

  ```ts
  import { Geom, Circle } from "@opendaw/lib-std/geom";

  const a: Circle = { x: 0, y: 0, r: 1 };
  const b: Circle = { x: 3, y: 0, r: 1 };
  Geom.outerTangentPoints(a, b);
  ```

- Color manipulation and utilities **color.ts**

  ```ts
  import { Color } from "@opendaw/lib-std/color";

  Color.hslToHex(0, 1, 0.5); // '#ff0000'
  ```

- Curve mathematics and operations **curve.ts**
- Time span calculations **time-span.ts**

  ```ts
  import { TimeSpan } from "@opendaw/lib-std/time-span";

  TimeSpan.minutes(5).toUnitString();
  ```

- Progress tracking utilities **progress.ts**
- Parameter handling utilities **parameters.ts**
- TypeScript decorators **decorators.ts**

  ```ts
  import { Lazy } from "@opendaw/lib-std/decorators";

  class Demo {
    @Lazy
    get value() {
      return Math.random();
    }
  }
  ```

- Random number generation **random.ts**
- Value guidance systems **value-guides.ts**
- Value mapping utilities **value-mapping.ts**
- String mapping operations **string-mapping.ts**

  ```ts
  import { StringMapping } from "@opendaw/lib-std/string-mapping";

  const mapping = StringMapping.percent();
  mapping.x(0.5); // { value: '50', unit: '%' }
  ```

- Warning emission helpers **warning.ts**

  ```ts
  import { warn } from "@opendaw/lib-std/warning";

  try {
    warn("deprecated");
  } catch (e) {}
  ```
