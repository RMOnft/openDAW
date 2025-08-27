# Modular UI

This directory contains the modular workspace used in the studio
application. Modules can be arranged visually and connected with
wires to build custom signal flows.

## Architecture

```mermaid
flowchart LR
    Modular --> ModularView
    ModularView --> Camera
    ModularView --> ModularEnvironment
    ModularEnvironment --> GenericModuleView
    ModularEnvironment --> ModularWires
```

## Wiring lifecycle

```mermaid
sequenceDiagram
    participant Connector
    participant Environment
    participant Wires
    Connector->>Environment: beginWiring()
    Environment->>Wires: preview()
    Wires-->>Connector: highlight
```
