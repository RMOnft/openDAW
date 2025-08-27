# Architecture Overview

The architecture of openDAW is described using the C4 model.

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

- **App** – Provides the user interface and coordinates system interactions.
- **Studio** – Handles audio processing, scheduling, and engine control.
- **Lib** – Supplies shared utilities and reusable logic across modules.
- **Config** – Delivers runtime and build settings consumed by other components.

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

Workers are installed once at application startup and provide services such as
file access and waveform analysis before being terminated when no longer
needed.
