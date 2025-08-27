import { int } from "@opendaw/lib-std";

/**
 * Generic timed MIDI event.
 * @typeParam TYPE - specific event type identifier.
 */
export interface Event<TYPE> {
  /** Delta time in ticks from the start of the track */
  readonly ticks: int;
  /** Event type identifier */
  readonly type: TYPE;
}
