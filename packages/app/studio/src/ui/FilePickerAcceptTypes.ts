/** Predefined `accept` type configurations for file picker dialogs. */
export namespace FilePickerAcceptTypes {
  /** Accepts Wave audio files. */
  export const WavFiles: FilePickerOptions = {
    types: [
      {
        description: "wav-file",
        accept: { "audio/wav": [".wav"] },
      },
    ],
  };

  /** Accepts openDAW project synchronisation log files. */
  export const ProjectSyncLog: FilePickerOptions = {
    types: [
      {
        description: "openDAW sync-log-file",
        accept: { "application/octet-stream": [".odsl"] },
      },
    ],
  };

  /** Accepts native openDAW project files. */
  export const ProjectFileType: FilePickerAcceptType = {
    description: "openDAW project",
    accept: { "application/octet-stream": [".od"] },
  };

  /** Accepts bundled project archives containing samples. */
  export const ProjectBundleFileType: FilePickerAcceptType = {
    description: "openDAW project bundle",
    accept: { "application/octet-stream": [".odb"] },
  };

  /** Accepts [dawproject](https://dawproject.org) interchange files. */
  export const DawprojectFileType: FilePickerAcceptType = {
    description: "dawproject",
    accept: { "application/octet-stream": [".dawproject"] },
  };
}