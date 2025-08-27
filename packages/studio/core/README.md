# Studio Core

The **studio core** package contains the runtime audio engine and supporting
utilities used by openDAW. It bundles the worklets, facade classes and
infrastructure required to load projects and process audio in the browser.

## Architecture

- **EngineWorklet** – AudioWorklet that executes project graphs and produces
  audio. It communicates with the main thread via message channels and shared
  memory.
- **EngineFacade** – High level wrapper around `EngineWorklet` exposing
  observable state and methods to control playback and recording.
- **WorkerAgents** – Helper for establishing communication with background
  workers for tasks such as peak generation and file system access.
- **MeterWorklet** – AudioWorklet that computes peak and RMS levels for live
  metering.

Further architectural details are covered in the documentation:

- [Architecture overview](../../docs/docs-dev/architecture/overview.md)
- [Audio path and scheduler](../../docs/docs-dev/architecture/audio-path.md)

