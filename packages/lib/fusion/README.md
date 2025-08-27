_This package is part of the openDAW SDK_

# @opendaw/lib-fusion

Web-based audio workstation fusion utilities for TypeScript projects.

## API Docs

See the [API documentation](https://opendaw.org/docs/api/fusion/) for detailed reference.

## File System Operations

* **OpfsWorker.ts** - Origin Private File System worker implementation
* **OpfsProtocol.ts** - OPFS communication protocol definitions

### Message Flow

```mermaid
sequenceDiagram
    participant Main
    participant Worker
    participant OPFS
    Main->>Worker: OpfsProtocol.open
    Worker->>OPFS: Read/Write
    Worker-->>Main: Result
```

## Audio Visualization

* **Peaks.ts** - Audio peak data management and processing
* **PeakWorker.ts** - Web Worker for peak generation
* **PeakProtocol.ts** - Peak data communication protocol
* **PeaksPainter.ts** - Canvas-based peak visualization rendering

### Message Flow

```mermaid
sequenceDiagram
    participant Main
    participant Worker
    Main->>Worker: SamplePeakProtocol.request
    Worker-->>Main: SamplePeakProtocol.response
```

## Live Audio Streaming

* **live-stream/** - Directory containing live audio stream processing utilities

### Message Flow

```mermaid
sequenceDiagram
    participant Broadcaster
    participant Receiver
    Broadcaster->>Receiver: AudioFrame
    Receiver-->>Broadcaster: Acknowledgement
```

## Core Types

* **types.ts** - Type definitions for fusion operations
