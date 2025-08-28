/**
 * Public interfaces for controlling the audio engine and reacting to note events.
 *
 * @packageDocumentation
 */
import {ppqn} from "@opendaw/lib-dsp"
import {
    byte,
    int,
    Nullable,
    ObservableValue,
    Observer,
    Subscription,
    Terminable,
    unitValue,
    UUID
} from "@opendaw/lib-std"
import {ClipNotification} from "@opendaw/studio-adapters"
import {Project} from "./Project"

/**
 * Event describing a note-on or note-off trigger emitted by the engine.
 *
 * @public
 */
export type NoteTrigger =
    | { type: "note-on", uuid: UUID.Format, pitch: byte, velocity: unitValue }
    | { type: "note-off", uuid: UUID.Format, pitch: byte }

/**
 * Abstraction of the playback engine exposing transport and sequencing control.
 *
 * @public
 */
export interface Engine extends Terminable {
    /** Starts playback. */
    play(): void
    /** Stops playback. */
    stop(): void
    /** Sets the current transport position. */
    setPosition(position: ppqn): void
    /** Begins recording with optional count-in. */
    startRecording(countIn: boolean): void
    /** Stops an active recording. */
    stopRecording(): void
    /** Resolves once the engine finished initialisation. */
    isReady(): Promise<void>
    /** Queries whether loading of resources has completed. */
    queryLoadingComplete(): Promise<boolean>
    /** Stops playback and resets state. */
    stop(): void
    /** Sends an all-notes-off to attached devices. */
    panic(): void
    /** Triggers a note-on event on an instrument. */
    noteOn(uuid: UUID.Format, pitch: byte, velocity: unitValue): void
    /** Triggers a note-off event on an instrument. */
    noteOff(uuid: UUID.Format, pitch: byte): void
    /** Subscribes to note trigger events. */
    subscribeNotes(observer: Observer<NoteTrigger>): Subscription
    /** Queues clips for playback. */
    scheduleClipPlay(clipIds: ReadonlyArray<UUID.Format>): void
    /** Cancels scheduled clips for tracks. */
    scheduleClipStop(trackIds: ReadonlyArray<UUID.Format>): void
    /** Subscribes to clip sequencing notifications. */
    subscribeClipNotification(observer: Observer<ClipNotification>): Subscription

    /** Current transport position. */
    get position(): ObservableValue<ppqn>
    /** Indicates that the engine is playing. */
    get isPlaying(): ObservableValue<boolean>
    /** Indicates that the engine is recording. */
    get isRecording(): ObservableValue<boolean>
    /** Indicates that the engine performs a count-in. */
    get isCountingIn(): ObservableValue<boolean>
    /** Whether the metronome is enabled. */
    get metronomeEnabled(): ObservableValue<boolean>
    /** Timestamp used for synchronisation. */
    get playbackTimestamp(): ObservableValue<ppqn>
    /** Total beats to count in before recording. */
    get countInBeatsTotal(): ObservableValue<int>
    /** Remaining count-in beats. */
    get countInBeatsRemaining(): ObservableValue<number>
    /** Active marker state, if any. */
    get markerState(): ObservableValue<Nullable<[UUID.Format, int]>>
    /** Project instance the engine operates on. */
    get project(): Project
}

