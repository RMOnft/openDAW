# Collections

The standard library includes a set of lean data structures that avoid
allocations and keep dependencies minimal.

## Sorted Set

`sorted-set.ts` implements an ordered set with custom key extraction and
comparison.  Lookups are `O(log n)` thanks to binary search over an internal
array.

## Multimap

`multimap.ts` provides array and set based multimap implementations allowing
multiple values per key.

## Maps & Objects

Utility helpers in `maps.ts` and `objects.ts` simplify working with
JavaScript's `Map`, `WeakMap` and plain object types.
