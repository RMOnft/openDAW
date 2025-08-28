# File Management

Import, export, and organize project files. openDAW stores data in the
browser's Origin Private File System (OPFS) so sessions and samples persist
offline. Developers can dive deeper in the
[project docs](../../docs-dev/projects/overview.md) and the
[info panel reference](../../docs-dev/ui/info-panel/overview.md).

## Browse and Organize Samples

- Use the **Sample Browser** to switch between cloud and local libraries.
- Search, preview and delete samples directly from the list.
- Adjust preview volume with the slider in the browser footer.
- Local samples are cached in OPFS and survive page reloads.

### Manage Local Storage

- Delete unused entries from the **Sample Browser** to free space.
- Project data and samples reside in the browser; exporting bundles is the
  safest backup.

## Save Projects

1. **Write changes to the browser.** Press <kbd>Ctrl</kbd>+<kbd>S</kbd> or choose
   _File → Save_ to store the current session in IndexedDB.
2. **Use autosave as a safety net.** openDAW periodically saves in the
   background, but exporting a bundle is the safest way to back up work.

## Edit Project Metadata

- Open the **Info Panel** to change the project name, tags, description and
  cover image.
- Changes are applied when an input loses focus or you press <kbd>Enter</kbd>.

## Export `.odb` Project Bundles

1. **Open the export dialog.** From the main menu select _File → Export_.
2. **Choose Project Bundle.** Pick _Project Bundle_ to package the project and
   all referenced samples into a single `.odb` file.
3. **Download and share.** Save the bundle locally or send it to a
   collaborator for restoration on another machine.
4. See the [Exporting workflow](../workflows/exporting.md) for a step‑by‑step guide.

## Import Audio Samples

1. **Drag and drop files.** Drop WAV, AIFF, or MP3 files onto the arranger or
   sampler to add them to the project.
2. **Use the file picker.** Alternatively choose _File → Import_ and browse to
   select audio files or an `.odb` bundle.
3. **Samples are copied.** Imported audio is stored inside the project so the
   session can be reopened without the original files.

## Storage Limits and Permissions

- **Browser quotas.** Sessions live in browser storage, which is typically
  capped at a few hundred megabytes. Large projects may hit this limit and fail
  to save.
- **Grant persistent storage.** Some browsers prompt for permission to keep
  data; allowing it prevents the browser from evicting sessions when space is
  low.
- **File access prompts.** Importing samples or exporting bundles may trigger a
  permission dialog. Accept these prompts so openDAW can read from and write to
  your device.
- **Keep backups.** Clearing site data or hitting storage limits removes local
  sessions. Regularly export `.odb` bundles to avoid losing work.

## Collaborate and Share

Use project bundles to collaborate. Export a bundle and send it to another
user who can open it and continue working. The
[Collaboration workflow](../workflows/collaboration.md) covers best
practices.

Detailed steps for exporting audio or bundles are available in the
[exporting and sharing workflow](../workflows/exporting-and-sharing.md).
