# Messaging

openDAW components communicate across thread and process boundaries using
light‑weight messaging abstractions built on top of the browser's
`postMessage` API.  The runtime's {@link packages/lib/runtime/src/messenger.ts | `Messenger`}
wraps `MessagePort`‑like endpoints and the {@link packages/lib/runtime/src/communicator.ts | `Communicator`}
layer adds a small RPC mechanism.

## Channels and Workers

```mermaid
sequenceDiagram
    participant Main
    participant Worker
    participant Worklet
    Main->>Worker: install shared worker
    Worker-->>Main: acknowledgement
    Main->>Worklet: construct AudioWorkletNode
    Worklet-->>Worker: exchange session data
```

## Remote Calls

```mermaid
sequenceDiagram
    participant Sender
    participant Executor
    Sender->>Executor: dispatchAndReturn(func, args)
    Executor-->>Sender: resolve(value)
```

Messages are structured cloned, so objects with methods or private fields lose
behaviour when transferred.  Always validate messages received from other
contexts and prefer passing plain data objects.
