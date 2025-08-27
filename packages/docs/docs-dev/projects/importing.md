# Importing and Exporting

Projects can be bundled into a single `.odb` file that includes all referenced samples.

```ts
const data = await Projects.exportBundle(session, progress)
const session = await Projects.importBundle(service, data)
```

`SampleUtils.verify` checks that all referenced samples exist and lets the user replace missing ones during import.
