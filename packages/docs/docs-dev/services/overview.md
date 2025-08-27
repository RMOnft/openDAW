# Service Layer Overview

The studio app exposes several services to coordinate complex tasks.

```mermaid
flowchart LR
  StudioService --> SessionService
  StudioService --> Shortcuts
  StudioService --> SyncLogService
  StudioService --> ExportStemsConfigurator
```
