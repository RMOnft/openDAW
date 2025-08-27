import { byte, int } from "@opendaw/lib-std";
import { Sample } from "@opendaw/studio-adapters";
import { EffectFactories, InstrumentFactories } from "@opendaw/studio-core";

/**
 * Type definitions describing drag payloads passed between drag sources and
 * drop targets inside the studio UI.
 */

/** Hint to drop targets that a drag operation should be copied instead of moved. */
export type DragCopyHint = { copy?: boolean };

/** Dragged sample originating from the browser's file system or library. */
export type DragSample = { type: "sample"; sample: Sample } & DragCopyHint;

/**
 * Raw file supplied by the host operating system.
 *
 * @remarks The file handle cannot be accessed while the drag operation is active.
 */
export type DragFile = {
  /** Type discriminator. */
  type: "file";
  /** Placeholder file handle; unusable until drop has completed. */
  file: File /* This cannot be accessed while dragging! */;
} & DragCopyHint;

/** Dragged device, instrument or playfield slot within the UI. */
export type DragDevice = (
  | {
      type: "midi-effect" | "audio-effect";
      start_index: int;
    }
  | {
      type: "midi-effect";
      start_index: null;
      device: EffectFactories.MidiEffectKeys;
    }
  | {
      type: "audio-effect";
      start_index: null;
      device: EffectFactories.AudioEffectKeys;
    }
  | {
      type: "instrument";
      device: InstrumentFactories.Keys;
    }
  | {
      type: "playfield-slot";
      index: byte;
      uuid: string;
    }
) &
  DragCopyHint;

/** Dragged channel strip reference. */
export type DragChannelStrip = {
  /** Discriminator identifying channel strip drags. */
  type: "channelstrip";
  /** Unique identifier of the strip. */
  uuid: string;
  /** Original index before dragging begins. */
  start_index: int;
} & DragCopyHint;

/** Union of all supported drag data shapes. */
export type AnyDragData =
  | DragSample
  | DragFile
  | DragDevice
  | DragChannelStrip;
