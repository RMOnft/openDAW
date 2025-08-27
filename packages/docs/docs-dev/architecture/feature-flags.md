# Feature Flags

openDAW relies on a handful of feature checks at startup to ensure the
Studio only runs in supported environments. The checks live in
[`packages/app/studio/src/features.ts`](../../../app/studio/src/features.ts)
and guard access to critical Web APIs.

## Runtime detection

`testFeatures()` verifies the presence of APIs such as:

- `Promise.withResolvers` for ergonomic asynchronous flows
- `indexedDB` for persistent project storage
- `AudioWorkletNode` for real‑time audio processing
- Origin Private File System access (`navigator.storage.getDirectory`) for
  project files
- `crypto.randomUUID` and `crypto.subtle.digest` for unique identifiers and
  cache validation

Each missing capability throws, preventing the Studio from starting.

## User messaging

When a requirement is not met the application renders the
[`MissingFeature`](../../../app/studio/src/ui/MissingFeature.tsx) component
which explains the limitation and suggests updating the browser.

## Extending flags

New checks can be added to `features.ts`. Keep the list concise and backed
by user-facing messaging so unsupported browsers fail fast and clearly.
