import { byte, int } from "@opendaw/lib-std";
import { Sample } from "@opendaw/studio-adapters";
import { EffectFactories, InstrumentFactories } from "@opendaw/studio-core";

/** Hint to drop targets that a drag operation should be copied instead of moved. */
export type DragCopyHint = { copy?: boolean };

/** Dragged sample originating from the browser's file system. */
export type DragSample = { type: "sample"; sample: Sample } & DragCopyHint;

/**
 * Raw file supplied by the host operating system. Note that the file handle
 * cannot be accessed while the drag operation is active.
 */
export type DragFile = {
  type: "file";
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
  type: "channelstrip";
  uuid: string;
  start_index: int;
} & DragCopyHint;

/** Union of all supported drag data shapes. */
export type AnyDragData = DragSample | DragFile | DragDevice | DragChannelStrip;
