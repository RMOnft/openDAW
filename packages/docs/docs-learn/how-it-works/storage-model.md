# Storage Model

openDAW stores project data inside the browser using the [Origin Private File
System (OPFS)](https://developer.mozilla.org/en-US/docs/Web/API/Origin_Private_File_System).
OPFS provides a sandboxed, persistent file system that is not visible to the
user's operating system. It allows the application to save audio files and
project state without requiring a network connection.

```mermaid
flowchart LR
    A[Project Data] --> B[OPFS]
    B --> C[Export Backup]
```

- **Project Data** – audio clips, arrangements, and other information created during a session.
- **OPFS** – the browser's private filesystem used by openDAW for local persistence.
- **Export Backup** – an archive of the OPFS contents that can be downloaded or synced elsewhere.

## Export

Projects can be exported at any time. Exporting creates a portable archive that
contains the project JSON along with referenced audio assets. The archive can be
downloaded to the local disk or uploaded to another service for sharing.

## Backup

To avoid data loss, openDAW periodically creates a backup of the OPFS data. The
backup can be written to IndexedDB or synchronised with a backend service when
the user is online. Restoring from a backup repopulates the OPFS directory so
that work can continue even after clearing browser storage.

## Quiz

1. What browser feature does openDAW use to store project data locally?
   - [x] Origin Private File System (OPFS)
   - [ ] LocalStorage
   - [ ] Cookies
2. Why might you export a backup of your project?
   - [ ] To increase latency
   - [x] To protect against data loss
   - [ ] To change the audio sample rate

