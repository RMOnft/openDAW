# Sync Log

The sync log records immutable commits that describe how a project changes over time.
Each commit stores a hash of the previous commit, allowing logs to be validated when
replayed. Writers observe the project graph and append commits while readers rebuild
a project by streaming the log sequentially.

## Format

1. **Init** – Serialized project at the time the log was created.
2. **Open** – Marker written whenever the project is opened.
3. **Updates** – Batches of project mutations.

Every commit includes a timestamp and cryptographic hash to ensure order and integrity.

## Reading and Writing

`SyncLogWriter` attaches to a `Project` and emits commits whenever transactions
occur. Logs can later be rehydrated with `SyncLogReader.unwrap`, which applies all
recorded updates in sequence.

For integration details see the implementation in the Studio services.
