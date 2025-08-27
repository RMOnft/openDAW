# Browser Support

openDAW targets modern browsers with full Web Audio and WebAssembly support.
Packages like [`@opendaw/app-studio`](./package-inventory.md#app) and
[`@opendaw/lib-dsp`](./package-inventory.md#lib) rely on these APIs. Build
configurations target Chrome 109+, Firefox 117+, Safari 16+, and Edge 109+.
The project is regularly tested on:

- **Chrome** (latest stable)
- **Firefox** (latest stable)
- **Safari** on macOS/iOS
- **Edge** (Chromium)

Other evergreen browsers that implement the necessary APIs may work but are not
officially supported. Ensure your browser is updated to the latest version for
the best experience. See [Build and Run](./build-and-run/setup.md) for setup
instructions.
