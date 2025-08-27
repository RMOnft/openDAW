_This package is part of the openDAW SDK_

# @opendaw/lib-runtime

Runtime utilities and asynchronous operations for TypeScript projects.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/) for detailed reference.

## Usage

```ts
import { Wait, Promises, Runtime, network, Fetch } from "@opendaw/lib-runtime"
```

### Async & Promises

Use {@link Promises.retry} to automatically retry failing operations:

```ts
const data = await Promises.retry(() => fetch("/data").then(r => r.json()))
```

Delay execution with {@link Wait.frames} or {@link Wait.timeSpan}:

```ts
await Wait.frames(2)
await Wait.timeSpan(TimeSpan.seconds(1))
```

Debounce calls using {@link Runtime.debounce}:

```ts
const log = Runtime.debounce(console.log, 500)
window.addEventListener("resize", () => log("resized"))
```

### Network & Communication

Limit concurrent requests with {@link network.limitFetch}:

```ts
const response = await network.limitFetch("/api")
```

Track download progress using {@link Fetch.ProgressArrayBuffer}:

```ts
const load = Fetch.ProgressArrayBuffer(p => console.log(p))
const buffer = await load(await fetch(url))
```

Create message channels via {@link Messenger} and build typed protocols with {@link Communicator.sender}:

```ts
const messenger = Messenger.for(new MessageChannel().port1)
const protocol = Communicator.sender(messenger, d => ({
  ping: () => d.dispatchAndForget(console.log, "pong")
}))
```

### Time & Performance

Estimate remaining time with {@link TimeSpanUtils.startEstimator}:

```ts
const estimate = TimeSpanUtils.startEstimator()
console.log(estimate(0.5).toString())
```

Measure code execution using {@link stopwatch}:

```ts
const sw = stopwatch()
sw.lab("step 1")
```