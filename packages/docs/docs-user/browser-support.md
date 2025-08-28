# Browser Support

openDAW runs in current versions of Chrome, Firefox, and Edge (Chromium).
Safari currently lacks the cross‑origin isolation features required for
`SharedArrayBuffer` and WebAssembly threads, so the Studio does not yet run
there. Modern input features such as pointer events and drag‑and‑drop are
also required and are best supported in these browsers.

For the best experience, keep your browser up to date. Some features—such as
MIDI access or advanced file APIs—may be limited depending on the browser.
Refer to the [developer browser support](../docs-dev/browser-support.md) for
technical details and version targets.

