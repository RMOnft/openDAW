import {UUID} from "@opendaw/lib-std"

/**
 * Describes clip state transitions reported by the
 * {@link @opendaw/studio-core-processors#EngineProcessor | engine processor}.
 */
export type ClipSequencingUpdates = {
    /** Clips that started playing. */
    started: ReadonlyArray<UUID.Format>
    /** Clips that stopped playing. */
    stopped: ReadonlyArray<UUID.Format>
    /** Clips scheduled but never started. */
    obsolete: ReadonlyArray<UUID.Format>
}

/**
 * Notification emitted when clip sequencing state changes.
 */
export type ClipNotification = {
    /** Sequencing changes such as start/stop events. */
    type: "sequencing"
    changes: ClipSequencingUpdates
} | {
    /** Clips waiting for resources. */
    type: "waiting"
    clips: ReadonlyArray<UUID.Format>
}
