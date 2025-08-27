# OPFS Worker

The `OpfsWorker` provides access to the Origin Private File System from a web
worker. It implements the [`OpfsProtocol`](../../../lib/fusion/src/opfs/OpfsProtocol.ts)
so the main thread can read, write and enumerate files without blocking.

```ts
// Initialize the worker
OpfsWorker.init(messenger)

// Write data
await protocol.write('demo.txt', data)
```
