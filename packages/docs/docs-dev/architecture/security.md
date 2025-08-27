# Security Architecture

openDAW isolates heavy audio processing inside dedicated workers and relies on
cross‑origin isolation to access low‑level browser APIs. Key aspects include:

- **Worker boundaries** – the UI and audio engine communicate via `postMessage`
  and structured clones, limiting direct access to shared state.
- **OPFS sandboxing** – project data is stored in the Origin Private File
  System so files remain local to the user's browser.
- **COOP/COEP** – Cross‑Origin Opener/Embedder Policy headers prevent foreign
  content from interfering with the application and enable `SharedArrayBuffer`.

Developers should treat every boundary as a security control and avoid
bypassing these mechanisms when extending the platform.
