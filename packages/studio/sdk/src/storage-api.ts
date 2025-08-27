/**
 * Handles persistent storage of project data and user media.
 *
 * @public
 */
export interface StorageAPI {
  /**
   * Read a file from persistent storage.
   * @param path - Path within the virtual file system.
   */
  readFile(path: string): Promise<ArrayBuffer>;

  /**
   * Write a file to persistent storage.
   * @param path - Destination path in the virtual file system.
   * @param data - Binary data to store.
   */
  writeFile(path: string, data: ArrayBuffer): Promise<void>;
}
