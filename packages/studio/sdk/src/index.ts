/**
 * Entry point for the openDAW Studio SDK.
 *
 * Re-exports the typed interfaces that allow host applications to
 * communicate with the studio engine.
 *
 * @packageDocumentation
 */

export type { ProjectAPI } from './project-api';
export type { DeviceAPI } from './device-api';
export type { TransportAPI } from './transport-api';
export type { RenderAPI } from './render-api';
export type { StorageAPI } from './storage-api';
export type { AudioAPI } from './audio-api';
export type { MidiAPI } from './midi-api';
export type { UiAPI } from './ui-api';
