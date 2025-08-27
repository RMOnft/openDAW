# Studio DAWproject Serialization

`DawProjectImport` and `DawProjectExporter` enable the Studio to exchange sessions
with other applications via the `.dawproject` format. The importer rebuilds the
box graph from `project.xml` and bundled resources, while the exporter walks the
current project and emits the corresponding `ProjectSchema`, packaging samples
and device presets along the way.

- Import: `DawProject.decode` unwraps the archive and `DawProjectImport.read`
  recreates the project skeleton.
- Export: `DawProjectExporter.write` gathers tracks and writes files via
  `DeviceIO` and the provided resource packer.

Return to the [serialization overview](./overview.md) or see the
[DAWproject mapping](./dawproject.md) for schema details.
