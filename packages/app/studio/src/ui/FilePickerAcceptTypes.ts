/**
 * Predefined {@link FilePickerOptions} and {@link FilePickerAcceptType}
 * configurations used throughout the studio when interacting with the
 * File System Access API.
 */
export namespace FilePickerAcceptTypes {
    /** Accept only uncompressed WAV audio files. */
    export const WavFiles: FilePickerOptions = {
        types: [{
            description: "wav-file",
            accept: {"audio/wav": [".wav"]}
        }]
    }
    /** Accept log files produced by project synchronization (.odsl). */
    export const ProjectSyncLog: FilePickerOptions = {
        types: [{
            description: "openDAW sync-log-file",
            accept: {"application/octet-stream": [".odsl"]}
        }]
    }

    /** Accept a raw openDAW project file (.od). */
    export const ProjectFileType: FilePickerAcceptType = {
        description: "openDAW project",
        accept: {"application/octet-stream": [".od"]}
    }

    /** Accept a bundled openDAW project archive (.odb). */
    export const ProjectBundleFileType: FilePickerAcceptType = {
        description: "openDAW project bundle",
        accept: {"application/octet-stream": [".odb"]}
    }

    /** Accept a DAWProject file (.dawproject). */
    export const DawprojectFileType: FilePickerAcceptType = {
        description: "dawproject",
        accept: {"application/octet-stream": [".dawproject"]}
    }
}
