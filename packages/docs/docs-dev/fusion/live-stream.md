# Live Stream

`LiveStreamBroadcaster` and `LiveStreamReceiver` exchange typed packages over a
message channel. Data is written into a shared buffer and guarded by a
single-byte lock.

```ts
const broadcaster = LiveStreamBroadcaster.create(messenger, 'audio')
broadcaster.broadcastFloats(address, buffer, update)

const receiver = new LiveStreamReceiver()
receiver.connect(messenger)
```
