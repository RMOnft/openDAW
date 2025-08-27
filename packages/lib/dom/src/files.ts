/**
 * Wrapper functions for the File System Access API with graceful fallbacks.
 *
 * @example
 * ```ts
 * const arrayBuffer = await fetch(url).then(r => r.arrayBuffer());
 * await Files.save(arrayBuffer, { suggestedName: "sample.bin" });
 * ```
 */
import { Arrays, asDefined, isDefined } from "@opendaw/lib-std";
import { Promises } from "@opendaw/lib-runtime";

export namespace Files {
  /**
   * Saves an `ArrayBuffer` as a file using the File System Access API when
   * available, falling back to a download link otherwise.
   *
   * @returns Name of the created file.
   */
  export const save = async (
    arrayBuffer: ArrayBuffer,
    options?: SaveFilePickerOptions,
  ): Promise<string> => {
    if (isDefined(window.showSaveFilePicker)) {
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.truncate(0);
      await writable.write(arrayBuffer);
      await writable.close();
      return handle.name ?? "unknown";
    } else {
      const blob = new Blob([arrayBuffer]);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = options?.suggestedName ?? `unknown`;
      anchor.click();
      URL.revokeObjectURL(url);
      return options?.suggestedName ?? "Unknown";
    }
  };

  /**
   * Opens a file selection dialog and returns the selected `File` objects.
   * Uses the File System Access API when supported and falls back to a
   * hidden `<input>` element otherwise.
   */
  export const open = async (
    options?: OpenFilePickerOptions,
  ): Promise<ReadonlyArray<File>> => {
    if (isDefined(window.showOpenFilePicker)) {
      const {
        status,
        value: fileHandles,
        error,
      } = await Promises.tryCatch(window.showOpenFilePicker(options));
      if (status === "rejected") {
        return Promise.reject(error);
      }
      return Promise.all(fileHandles.map((fileHandle) => fileHandle.getFile()));
    } else {
      return new Promise<ReadonlyArray<File>>((resolve, reject) => {
        if (isDefined(options)) {
          console.warn(
            "FileApi.showOpenFilePicker is emulated in this browser. OpenFilePickerOptions are ignored.",
          );
        }
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = options?.multiple ?? false;
        fileInput.style.display = "none";
        fileInput.addEventListener("cancel", async () => {
          fileInput.remove();
          reject(new DOMException("cancel", "AbortError"));
        });
        fileInput.addEventListener("change", async (event: Event) => {
          const target = event.target as HTMLInputElement;
          const files = target.files;
          if (isDefined(files)) {
            resolve(
              Arrays.create(
                (index) =>
                  asDefined(files.item(index), `No file at index ${index}`),
                files.length,
              ),
            );
          } else {
            reject(new DOMException("cancel", "AbortError"));
          }
          fileInput.remove();
        });
        document.body.appendChild(fileInput);
        fileInput.click();
      });
    }
  };
}
