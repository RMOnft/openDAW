# Offline Rendering

The `AudioOfflineRenderer` module exports project audio without relying on the
real-time audio graph. It uses the browser's `OfflineAudioContext` to render
tracks faster than real time and encode the result to WAV or stems for download.

Related modules:

- `AudioOfflineRenderer`
