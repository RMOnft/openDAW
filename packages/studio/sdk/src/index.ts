/**
 * Entry point for the openDAW Studio SDK.
 *
 * Re-exports the typed interfaces that allow host applications to
 * communicate with the studio engine.
 *
 * @packageDocumentation
 */

/** Project management utilities for loading and saving sessions. */
export type { ProjectAPI } from './project-api';
/** Interface for enumerating and selecting input/output hardware. */
export type { DeviceAPI } from './device-api';
/** Transport controls for playback and position. */
export type { TransportAPI } from './transport-api';
/** Offline rendering utilities. */
export type { RenderAPI } from './render-api';
/** Project persistence and loading. */
export type { StorageAPI } from './storage-api';
/** Low-level audio helpers. */
export type { AudioAPI } from './audio-api';
/** MIDI messaging helpers. */
export type { MidiAPI } from './midi-api';
/** UI integration helpers for custom panels. */
export type { UiAPI } from './ui-api';
