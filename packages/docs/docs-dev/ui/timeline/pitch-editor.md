# Pitch Editor

Canvas driven interface for manipulating note pitch and timing.

```mermaid
sequenceDiagram
    participant User
    participant PitchEditor
    participant Painter
    User->>PitchEditor: drag note
    PitchEditor->>Painter: request redraw
    Painter-->>PitchEditor: render notes
```

- **PitchEditor** handles event capturing and selection.
- **Painter** draws notes, scales and guides to the canvas.
