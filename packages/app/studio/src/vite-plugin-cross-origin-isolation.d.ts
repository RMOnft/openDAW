/**
 * Type declaration for the `vite-plugin-cross-origin-isolation` package.
 *
 * The plugin injects the `Cross-Origin-Opener-Policy` and
 * `Cross-Origin-Embedder-Policy` headers into Vite's dev server so the
 * Studio runs in a `crossOriginIsolated` context. This is required for
 * advanced Web APIs such as `SharedArrayBuffer` and WebAssembly threads.
 * See the developer documentation in
 * `docs-dev/build-and-run/cross-origin-isolation.md` for details.
 */
declare module 'vite-plugin-cross-origin-isolation' {
    import { Plugin } from 'vite'

    /**
     * Factory returning the Vite plugin instance that applies the necessary
     * HTTP headers for cross-origin isolation.
     */
    export default function crossOriginIsolation(): Plugin
}