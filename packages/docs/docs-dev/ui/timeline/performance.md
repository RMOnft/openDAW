# Timeline Performance

Timeline editors request rendering through a `CanvasPainter` which batches
updates and draws only the visible portion of a region. This avoids expensive
full‑canvas redraws while the user interacts with clips.

```mermaid
sequenceDiagram
    participant Editor
    participant Painter
    participant Renderer
    Editor->>Painter: requestUpdate
    Painter->>Renderer: onFrame()
    Renderer->>Painter: draw to canvas
```

Minimising work per frame keeps interaction responsive even with complex
automation curves or dense note regions.
