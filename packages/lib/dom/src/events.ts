// Supported Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (Chromium)
import { isDefined, Nullable, Procedure, Subscription } from "@opendaw/lib-std";

type KnownEventMap = WindowEventMap & MIDIInputEventMap & MIDIPortEventMap;

/**
 * Strongly typed helpers for subscribing to DOM events.
 */
export class Events {
  /**
   * Subscribes to a well known DOM event and returns a {@link Subscription}
   * that can be terminated later.
   *
   * @example
   * ```ts
   * const sub = Events.subscribe(window, "resize", () => console.log("resized"));
   * // ...later
   * sub.terminate();
   * ```
   *
   * @param eventTarget Target dispatching the event.
   * @param type Name of the event to listen for.
   * @param listener Callback handling the event.
   * @param options Optional `addEventListener` configuration.
   * @returns Subscription object to remove the listener.
   */
  static subscribe<K extends keyof KnownEventMap>(
    eventTarget: EventTarget,
    type: K,
    listener: (ev: KnownEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): Subscription {
    eventTarget.addEventListener(type, listener as EventListener, options);
    return {
      terminate: () =>
        eventTarget.removeEventListener(
          type,
          listener as EventListener,
          options,
        ),
    };
  }

  /**
   * Subscribes to an arbitrary event by name.
   *
   * @param eventTarget Target dispatching the event.
   * @param type Name of the custom event.
   * @param listener Callback handling the event.
   * @param options Optional `addEventListener` configuration.
   * @returns Subscription object to remove the listener.
   */
  static subscribeAny<E extends Event>(
    eventTarget: EventTarget,
    type: string,
    listener: (event: E) => void,
    options?: boolean | AddEventListenerOptions,
  ): Subscription {
    eventTarget.addEventListener(type, listener as EventListener, options);
    return {
      terminate: (): void =>
        eventTarget.removeEventListener(
          type,
          listener as EventListener,
          options,
        ),
    };
  }

  static DOUBLE_DOWN_THRESHOLD = 200 as const;

  /**
   * Subscribes to consecutive `pointerdown` events that occur within
   * {@link DOUBLE_DOWN_THRESHOLD} milliseconds.
   */
  static subscribeDblDwn = (
    eventTarget: EventTarget,
    listener: (event: PointerEvent) => void,
  ): Subscription => {
    let lastDownTime: number = 0.0;
    return this.subscribe(
      eventTarget,
      "pointerdown",
      (event) => {
        const now = performance.now();
        if (now - lastDownTime < this.DOUBLE_DOWN_THRESHOLD) {
          listener(event);
        }
        lastDownTime = now;
      },
      { capture: true },
    );
  };

  /**
   * Convenience handler that calls `preventDefault` on the event.
   *
   * @param event Event to cancel.
   */
  static readonly PreventDefault: Procedure<Event> = (event) =>
    event.preventDefault();

  /**
   * Checks whether the given target is a text input element.
   *
   * @param target Event target to inspect.
   * @returns `true` if the target represents an editable text field.
   */
  static readonly isTextInput = (target: Nullable<EventTarget>): boolean =>
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement &&
      isDefined(target.getAttribute("contenteditable")));
}

/**
 * Subset of the `Element` interface that supports pointer capture.
 */
export interface PointerCaptureTarget extends EventTarget {
  /** Assigns future pointer events with the given id to this target. */
  setPointerCapture(pointerId: number): void;
  /** Releases previously captured pointer events. */
  releasePointerCapture(pointerId: number): void;
  /** Tests whether this target currently has capture for the pointer. */
  hasPointerCapture(pointerId: number): boolean;
}
