/**
 * Type declaration for the `vite-plugin-cross-origin-isolation` package.
 *
 * The plugin enables cross-origin isolation headers during development so
 * that features like WebAssembly threads work as expected.
 */
declare module 'vite-plugin-cross-origin-isolation' {
    import { Plugin } from 'vite'

    /**
     * Factory returning the Vite plugin instance that applies the necessary
     * HTTP headers for cross-origin isolation.
     */
    export default function crossOriginIsolation(): Plugin
}