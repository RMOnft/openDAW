# Cross-Origin Isolation

openDAW relies on a [cross-origin isolated](https://developer.mozilla.org/docs/Web/API/Window/crossOriginIsolated) environment to unlock advanced Web APIs such as `SharedArrayBuffer`, WebAssembly threads and AudioWorklets. During development this isolation is provided by the `vite-plugin-cross-origin-isolation` package.

## Development

- The Studio's `vite.config.ts` installs the plugin and sets the `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers.
- `index.html` mirrors these headers with matching `<meta>` tags to keep `window.crossOriginIsolated` true.
- Start the dev server with `npm run dev:studio` and navigate to `https://localhost:8080`.
- In the browser console, verify that `window.crossOriginIsolated === true` before continuing.

## Why it matters

Without cross-origin isolation the browser blocks features required for real‑time audio processing. If `window.crossOriginIsolated` is `false` the application will terminate early.

## Browser support

Chromium based browsers and Firefox support the required headers. Safari currently lacks full cross-origin isolation support and therefore cannot run the Studio reliably. See the [user browser support guide](../../docs-user/browser-support.md) for up-to-date information.
