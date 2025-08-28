# Ring Buffers

openDAW transfers audio between threads using shared-memory ring buffers. The
[`RingBuffer` helper](../../studio/adapters/src/RingBuffer.ts) manages a
`SharedArrayBuffer` that stores planar chunks of audio data and exposes
lightweight reader and writer utilities. Worklets such as the
[`RecordingWorklet`](../../studio/core/src/Worklets.ts) use this mechanism to
move audio from the real-time engine to the main thread without costly
structured cloning.

Each ring buffer reserves a header with atomic pointers followed by a contiguous
block of channel data. Writers advance the write pointer after copying a block
and notify readers via `Atomics.notify`, while readers block or poll until new
chunks are available. This design minimises latency and garbage creation when
streaming audio between the engine, worklets and UI.
