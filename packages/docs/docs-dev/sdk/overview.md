# SDK Overview

The Studio SDK provides TypeScript interfaces for controlling the openDAW
engine from a host application. Modules are grouped by responsibility and
can be imported individually or via the aggregated package
`@opendaw/studio-sdk`.

## Modules

- `audio-api` – access to the audio engine.
- `device-api` – enumeration and selection of hardware devices.
- `midi-api` – MIDI input and output handling.
- `project-api` – project lifecycle management.
- `render-api` – offline rendering of audio.
- `storage-api` – persistent file access.
- `transport-api` – timeline and playback control.
- `ui-api` – extension points for user interfaces.
