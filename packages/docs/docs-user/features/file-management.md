# File Management

Import, export, and organize project files.

## Save Projects

1. **Write changes to the browser.** Press <kbd>Ctrl</kbd>+<kbd>S</kbd> or choose
   _File → Save_ to store the current session in IndexedDB.
2. **Use autosave as a safety net.** openDAW periodically saves in the
   background, but exporting a bundle is the safest way to back up work.

## Export `.odb` Project Bundles

1. **Open the export dialog.** From the main menu select _File → Export_.
2. **Choose Project Bundle.** Pick _Project Bundle_ to package the project and
   all referenced samples into a single `.odb` file.
3. **Download and share.** Save the bundle locally or send it to a
   collaborator for restoration on another machine.

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
