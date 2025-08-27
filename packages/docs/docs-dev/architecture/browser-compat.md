# Browser Compatibility

openDAW builds target modern evergreen browsers and rely on feature detection
within `@opendaw/lib-dom` to provide consistent behavior across engines. The
applications are compiled for Chrome 109+, Firefox 117+, Safari 16+, and Edge
109+. When a required API is missing, the DOM helpers either polyfill the
functionality or surface a clear error.

For a general overview see the [browser support guide](../browser-support.md).
