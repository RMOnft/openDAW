/**
 * Additional methods available on {@link FileSystemFileHandle} in
 * supporting browsers. The synchronous access handle allows for
 * performant reads and writes on files stored in the origin private
 * file system.
 */
interface FileSystemFileHandle {
  /** Creates a synchronous access handle for low-level file I/O. */
  createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
}

/**
 * Minimal surface of the synchronous file handle used by the studio
 * for working with binary project data.
 */
interface FileSystemSyncAccessHandle {
  /** Writes bytes to the file at the given offset. */
  write(buffer: BufferSource, options?: { at?: number }): number;
  /** Reads bytes from the file into the provided buffer. */
  read(buffer: BufferSource, options?: { at?: number }): number;
  /** Returns the current size of the file. */
  getSize(): number;
  /** Truncates the file to the specified size. */
  truncate(newSize: number): void;
  /** Flushes pending writes to disk. */
  flush(): void;
  /** Closes the handle releasing underlying resources. */
  close(): void;
}

/**
 * Extension of {@link FileSystemDirectoryHandle} to support iteration
 * over contained handles.
 */
interface FileSystemDirectoryHandle {
  /** Returns an async iterator over directory entries. */
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

/**
 * Identifier describing the current audio output sink. Either a device
 * id or an object indicating that no explicit sink is selected.
 */
type AudioSinkInfo = string | { type: "none" };

/**
 * Augments the {@link AudioContext} with the ability to select the audio
 * output device when the browser supports it.
 */
interface AudioContext {
  /** Sets the output device for this audio context. */
  setSinkId(id: AudioSinkInfo): Promise<void>;
  /** Gets the currently selected sink identifier. */
  get sinkId(): AudioSinkInfo;
}
