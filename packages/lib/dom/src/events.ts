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
   */
  static readonly PreventDefault: Procedure<Event> = (event) =>
    event.preventDefault();

  /**
   * Checks whether the given target is a text input element.
   */
  static readonly isTextInput = (target: Nullable<EventTarget>): boolean =>
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement &&
      isDefined(target.getAttribute("contenteditable")));
}

export interface PointerCaptureTarget extends EventTarget {
  setPointerCapture(pointerId: number): void;
  releasePointerCapture(pointerId: number): void;
  hasPointerCapture(pointerId: number): boolean;
}
