/**
 * @file Type definitions for objects that own time based events such as regions or
 * audio files. Readers expose a normalised API used by timeline editors to
 * query and react to these event owners regardless of their concrete type.
 */
import { ppqn } from "@opendaw/lib-dsp";
import { int, Observer, Option, Subscription } from "@opendaw/lib-std";
import { TimelineRange } from "@/ui/timeline/TimelineRange.ts";
import { TimeAxisCursorMapper } from "@/ui/timeline/TimeAxis.tsx";
import { NoteEventCollectionBoxAdapter } from "@opendaw/studio-adapters";
import { ValueEventCollectionBoxAdapter } from "@opendaw/studio-adapters";
import { AudioFileBoxAdapter } from "@opendaw/studio-adapters";
import { TrackBoxAdapter } from "@opendaw/studio-adapters";

/** Reader specialised for regions containing audio events. */
export interface AudioEventOwnerReader extends EventOwnerReader<never> {
  /** Adapted audio file backing the region. */
  get file(): AudioFileBoxAdapter;
  /** Gain applied to playback of the region. */
  get gain(): number;
}

/** Reader for regions containing note events. */
export interface NoteEventOwnerReader
  extends EventOwnerReader<NoteEventCollectionBoxAdapter> {}

/** Reader for regions containing automation or other value events. */
export interface ValueEventOwnerReader
  extends EventOwnerReader<ValueEventCollectionBoxAdapter> {}

/**
 * Abstraction over an entity on the timeline that owns time based content.
 * Provides accessors for temporal and visual properties and exposes hooks for
 * observing changes.
 */
export interface EventOwnerReader<CONTENT> extends TimeAxisCursorMapper {
  /** Start position of the owner measured in pulses. */
  get position(): ppqn;
  /** Length of the owner in pulses. */
  get duration(): ppqn;
  /** Offset of the loop inside the owner. */
  get loopOffset(): ppqn;
  /** Length of the loop region. */
  get loopDuration(): ppqn;
  /** Duration of the underlying content. */
  get contentDuration(): ppqn;
  set contentDuration(value: ppqn);
  /** Start of the region taking loop offset into account. */
  get offset(): ppqn;
  /** End position of the region. */
  get complete(): ppqn;
  /** Hue used to colorise the region. */
  get hue(): int;
  /** Whether the owner currently has content. */
  get hasContent(): boolean;
  /** True when the region references mirrored content. */
  get isMirrored(): boolean;
  /** Access to the underlying content representation. */
  get content(): CONTENT;
  /** Track containing this region if available. */
  get trackBoxAdapter(): Option<TrackBoxAdapter>;

  /** Subscribe to change events on the owner. */
  subscribeChange(observer: Observer<void>): Subscription;
  /** Adjust the provided range when the owner overlaps its boundaries. */
  watchOverlap(range: TimelineRange): Subscription;
}
