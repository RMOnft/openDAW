# Performance

openDAW runs entirely in the browser and aims to stay responsive even with complex projects. Performance tips for contributors:

- Avoid heavy allocations in the audio thread; prefer pre-allocated buffers.
- Use Web Workers or AudioWorklets for CPU‑intensive tasks.
- Profile with the browser dev tools to spot layout thrashing or long tasks.
- When adding features, measure rendering and audio latency to prevent regressions.

Contributors are encouraged to document any performance benchmarks or profiling results in pull requests.
