# Observers

Reactive patterns in the standard library are built around small, synchronous
primitives.

- `observers.ts` defines the `Observer` callback type.
- `observables.ts` and `notifier.ts` provide observable values and a simple
  broadcaster.
- `terminable.ts` supplies lifecycle management for subscriptions.

Together these pieces enable lightweight reactive flows without pulling in a
full reactive framework.
