# SyncLog Service

Records project changes to a SyncLog file for auditing or collaboration.

```mermaid
flowchart TD
  start --> write --> file
  file --> append
```
