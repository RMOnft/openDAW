# Sample Loading Pipeline

This document outlines the flow for retrieving and previewing audio samples in the studio browser.

1. **Discovery** – `SampleBrowser` requests metadata from either the local `SampleStorage`
   or the remote [`SampleApi`](../../../app/studio/src/service/SampleApi.ts).
2. **Selection** – the user selects entries rendered by `SampleView` which exposes
   metadata for each sample.
3. **Playback** – selections are previewed through `SamplePlayback`, buffering from
   `SampleStorage` when available and falling back to the server.
4. **Management** – actions such as renaming or deletion are routed through
   `SampleService` and the dialog helpers in `SampleDialogs`.

This modular pipeline allows the browser UI to remain agnostic about where the
samples originate while keeping playback responsive.
