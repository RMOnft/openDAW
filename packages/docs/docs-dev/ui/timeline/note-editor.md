# Note Editor

Coordinates pitch and property views to edit MIDI notes.

```mermaid
sequenceDiagram
    participant User
    participant NoteEditor
    participant PitchEditor
    participant PropertyEditor
    User->>NoteEditor: interact
    NoteEditor->>PitchEditor: update pitch view
    NoteEditor->>PropertyEditor: update property lanes
```

- **NoteEditor** wires pitch and property editors with selection and menus.
- **PitchEditor** displays notes on a piano roll grid.
- **PropertyEditor** shows velocity and other controllers.
