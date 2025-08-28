# DAWproject Workflow

openDAW Studio can exchange projects with other digital audio workstations
through the `.dawproject` format.

1. **Export a DAWproject file.** Choose *File → Export → DAWproject* to create an
   archive containing the current session and all referenced audio files.
2. **Import a DAWproject file.** Use *File → Import* and select a `.dawproject`
   bundle to start a new session from it. Imported projects are automatically
   migrated to the latest Studio schema.
3. **Edit and re-export.** Once imported, the project behaves like any other
   openDAW session and can be saved or exported again at any time.

For technical details see the [developer serialization guide](../../docs-dev/serialization/studio-dawproject.md)
and the [project migration reference](../../docs-dev/serialization/migration.md).
