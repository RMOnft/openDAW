# Worker Integration

Fusion workers communicate via `postMessage` and structured clones. Instantiate
a worker, pass a `MessagePort` to the main thread and follow the protocol's
request/response patterns to coordinate long running tasks.
