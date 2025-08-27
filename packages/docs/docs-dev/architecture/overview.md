# Architecture Overview

openDAW is composed of several packages such as
[`@opendaw/app-studio`](../package-inventory.md#app) and
[`@opendaw/studio-core`](../package-inventory.md#studio). The architecture is
described using the C4 model. For a step‑by‑step look at how the
application starts, see the [bootstrapping sequence](./bootstrap.md). Refer to
the [project roadmap](../../../../ROADMAP.md) for milestone context.

Static assets like the abstract SVG set in
`packages/app/studio/public/viscious-speed` are bundled with the app; see that
folder's README for a complete list and licensing details.

## Context

```mermaid
C4Context
    title openDAW Context Diagram
    Person(user, "Musician", "Creates and edits audio projects")
    System(system, "openDAW", "Web‑based digital audio workstation")
    System_Ext(browser, "Web Browser", "Hosts the application")
    System_Ext(files, "File System", "Stores project data")
    Rel(user, system, "Uses")
    Rel(system, browser, "Runs inside")
    Rel(system, files, "Reads and writes projects")
```

## Containers

```mermaid
C4Container
    title openDAW Container Diagram
    Person(user, "Musician")
    System_Boundary(opendaw, "openDAW") {
        Container(app, "App", "Next.js/React", "User interface and orchestration")
        Container(studio, "Studio", "Audio Engine", "Audio processing and scheduling")
        Container(lib, "Lib", "Shared utilities", "Reusable logic")
        Container(config, "Config", "Configuration", "Runtime and build settings")
    }
    System_Ext(browser, "Web Browser")
    Rel(user, app, "Interacts with")
    Rel(app, studio, "Controls")
    Rel(app, lib, "Uses")
    Rel(app, config, "Loads")
    Rel(studio, browser, "Audio output")
```

## Components

```mermaid
C4Component
    title openDAW Component Diagram
    Component(app, "App", "Next.js/React", "User interface and orchestration")
    Component(studio, "Studio", "Audio Engine", "Audio processing and scheduling")
    Component(lib, "Lib", "Shared utilities", "Reusable logic")
    Component(config, "Config", "Configuration", "Runtime and build settings")
    Rel(app, studio, "Controls")
    Rel(app, lib, "Uses")
    Rel(app, config, "Loads")
    Rel(studio, lib, "Uses")
```

- **App** – Provides the user interface and coordinates system interactions. Implemented in
  [`@opendaw/app-studio`](../package-inventory.md#app).
- **Studio** – Handles audio processing, scheduling, and engine control. Powered by
  [`@opendaw/studio-core`](../package-inventory.md#studio).
- **Lib** – Supplies shared utilities and reusable logic across modules from packages like
  [`@opendaw/lib-runtime`](../package-inventory.md#lib).
- **Config** – Delivers runtime and build settings consumed by other components through
  [`@opendaw/eslint-config`](../package-inventory.md#config) and related packages.

For a deeper look at timing, see the [audio path](./audio-path.md), and
learn how to build the project in [Build and Run](../build-and-run/setup.md).

- **App** – Provides the user interface and coordinates system interactions.
- **Studio** – Handles audio processing, scheduling, and engine control.
- **Lib** – Supplies shared utilities and reusable logic across modules.
- **Config** – Delivers runtime and build settings consumed by other components.

Communication between these parts is based on lightweight message channels; see
the [messaging architecture](./messaging.md) for details.

## Worker Lifecycle

```mermaid
sequenceDiagram
    participant Main
    participant Worker
    Main->>Worker: install bundled script
    Worker->>Worker: initialise services
    Main->>Worker: invoke protocols
    Main-->>Worker: terminate
```

![Worker flow diagram](../../../../assets/architecture/worker-flow.svg)

Workers are installed once at application startup and provide services such as
file access and waveform analysis before being terminated when no longer
needed.

For details about the studio runtime internals see the
[studio core README](../../../studio/core/README.md).

Developers integrating the engine can start with the [SDK overview](../sdk/overview.md).

Additional utilities for DOM interactions are described in the [DOM developer docs](../dom/overview.md).
