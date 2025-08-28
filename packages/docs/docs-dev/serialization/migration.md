# Project Migration

`ProjectMigration` upgrades legacy Studio project graphs to the current
schema. After decoding a project or importing a `.dawproject` archive, the
migration step inserts missing boxes and normalizes values so the rest of the
application can operate on a consistent structure.

- Runs on the skeleton produced by `DawProjectImport.read` before the project
  is opened.
- Creates required global helpers such as the `GrooveShuffleBox` and converts
  outdated event representations.
- New migration rules can be added to `ProjectMigration.migrate` as the project
  graph evolves.

Return to the [serialization overview](./overview.md).

