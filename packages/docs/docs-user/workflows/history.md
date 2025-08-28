# Project History

openDAW can record a stream of changes made to a project. The log is stored in an
`.odsl` file and can be appended to or replayed later.

## Starting a Log

Use the **Start SyncLog** command to choose a destination file. From that point on,
all edits are written as commits.

## Appending to Existing Logs

Select **Append SyncLog** and pick an existing `.odsl` file. The project is restored
from the log and new commits are added to the end.

## Replaying

Logs can be opened directly through the append workflow. The reader rebuilds the
project by applying each commit sequentially.

For implementation details see the [sync log architecture](../../docs-dev/architecture/sync-log.md).
