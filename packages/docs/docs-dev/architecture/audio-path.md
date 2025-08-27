# Audio Path and Scheduler

The sequence below shows how audio events travel through the system.

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Scheduler
    participant AudioEngine
    participant Output

    User->>App: Start playback
    App->>Scheduler: Submit audio events
    Scheduler->>AudioEngine: Dispatch events at precise times
    AudioEngine->>Output: Render audio
    loop Each audio frame
        Scheduler->>AudioEngine: Provide next events
        AudioEngine->>Output: Produce sound
    end
```

## Scheduler States

The scheduler manages the lifecycle of events as they move from being submitted to the moment they are processed.

```mermaid
stateDiagram-v2
    [*] --> queued
    queued --> running: dispatched to engine
    running --> completed: finished playback
    completed --> [*]
```

Events enter the **queued** state when the app submits them to the scheduler. At their scheduled time they move to the **running** state as the scheduler dispatches them to the audio engine. Once an event has been processed by the audio engine it reaches the **completed** state, leaving the scheduler's active set.

