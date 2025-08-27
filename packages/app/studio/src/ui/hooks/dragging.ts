import { Dragging, PointerCaptureTarget } from "@opendaw/lib-dom";
import {
  Func,
  Option,
  safeExecute,
  Terminable,
  unitValue,
  ValueGuide,
} from "@opendaw/lib-std";

/** Helpers to capture pointer dragging and map it to unit value changes. */
export namespace ValueDragging {
  /**
   * Callbacks controlling the lifecycle of a value dragging session.
   * Returning `AbortSignal` allows integration with external cancellation.
   */
  export interface Process {
    /** Retrieve the starting unit value. */
    start(): unitValue;
    /** Update the value while dragging. */
    modify(value: unitValue): void;
    /** Commit the new value when the drag ends normally. */
    finalise(prevValue: unitValue, newValue: unitValue): void;
    /** Restore the previous value if the drag is cancelled. */
    cancel(prevValue: unitValue): void;
    /** Optional cleanup after the drag completes. */
    finally?(): void;
    abortSignal?: AbortSignal;
  }

  /**
   * Installs a pointer drag handler that updates a unit value relative to the
   * initial pointer position.
   */
  export const installUnitValueRelativeDragging = (
    factory: Func<PointerEvent, Option<Process>>,
    target: PointerCaptureTarget,
    options?: ValueGuide.Options,
  ): Terminable =>
    Dragging.attach(target, (event: PointerEvent) => {
      const optProcess = factory(event);
      if (optProcess.isEmpty()) {
        return Option.None;
      }
      const horizontal = options?.horizontal === true;
      const process = optProcess.unwrap();
      const startValue = process.start();
      const guide = ValueGuide.create(options);
      if (event.shiftKey) {
        guide.disable();
      } else {
        guide.enable();
      }
      guide.begin(startValue);
      guide.ratio(event.altKey ? 0.25 : (options?.ratio ?? 1.0));
      let pointer = horizontal ? event.clientX : -event.clientY;
      return Option.wrap({
        abortSignal: process.abortSignal,
        update: (event: Dragging.Event): void => {
          if (event.shiftKey) {
            guide.disable();
          } else {
            guide.enable();
          }
          guide.ratio(event.altKey ? 0.25 : (options?.ratio ?? 1.0));
          const newPointer = horizontal ? event.clientX : -event.clientY;
          guide.moveBy(newPointer - pointer);
          pointer = newPointer;
          process.modify(guide.value());
        },
        approve: () => process.finalise(startValue, guide.value()),
        cancel: () => process.cancel(startValue),
        finally: () => safeExecute(process.finally),
      });
    });
}
