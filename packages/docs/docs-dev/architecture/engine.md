# Engine Sequence Diagrams

The studio engine coordinates audio worklets and worker agents to render and record audio. The following sequences illustrate key interactions.

## Engine Startup

```mermaid
sequenceDiagram
    participant App
    participant Worklets
    participant EngineWorklet
    participant WorkerAgents

    App->>Worklets: install(workletURL)
    Worklets->>EngineWorklet: createEngine(project)
    EngineWorklet->>WorkerAgents: initialise services
    WorkerAgents-->>EngineWorklet: ready
    EngineWorklet-->>App: isReady()
```

## Recording Flow

```mermaid
sequenceDiagram
    participant App
    participant Worklets
    participant RecordingWorklet
    participant SampleStorage

    App->>Worklets: createRecording()
    Worklets->>RecordingWorklet: configure ring buffer
    RecordingWorklet->>App: stream peaks
    App->>RecordingWorklet: finalize()
    RecordingWorklet->>SampleStorage: store audio & peaks
```

For a broader view of the system see the [architecture overview](./overview.md).

