# Property Editor

Displays and edits per-note properties such as velocity or modulation.

```mermaid
sequenceDiagram
    participant User
    participant PropertyEditor
    participant ModifyContext
    User->>PropertyEditor: drag property node
    PropertyEditor->>ModifyContext: apply modifier
    ModifyContext-->>PropertyEditor: emit update
```

- **PropertyEditor** hosts draggable property nodes for the selection.
- **ModifyContext** manages undoable changes while editing.
