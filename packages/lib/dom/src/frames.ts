/**
 * Animation frame scheduling utilities.
 *
 * Provides a lightweight wrapper around `requestAnimationFrame` that allows
 * registering recurring or one‑off callbacks.
 *
 * @example
 * ```ts
 * import {AnimationFrame} from "@opendaw/lib-dom";
 * AnimationFrame.add(() => console.log("tick"));
 * AnimationFrame.start();
 * ```
 */
import { Exec, int, Terminable } from "@opendaw/lib-std";

export namespace AnimationFrame {
  const nonrecurring = new Set<Exec>();
  const recurring = new Set<Exec>();
  const queue = new Array<Exec>();

  let id: int = -1;

  /** Adds a recurring callback executed every frame. */
  export const add = (exec: Exec): Terminable => {
    recurring.add(exec);
    return { terminate: (): unknown => recurring.delete(exec) };
  };

  /** Schedules a callback to run only once on the next frame. */
  export const once = (exec: Exec): void => {
    nonrecurring.add(exec);
  };

  /** Starts the internal animation frame loop. */
  export const start = (): void => {
    console.debug("AnimationFrame start");
    const exe = (): void => {
      if (recurring.size > 0 || nonrecurring.size > 0) {
        recurring.forEach((exec: Exec) => queue.push(exec));
        nonrecurring.forEach((exec: Exec) => queue.push(exec));
        nonrecurring.clear();
        queue.forEach((exec: Exec) => exec());
        queue.length = 0;
      }
      id = requestAnimationFrame(exe);
    };
    id = requestAnimationFrame(exe);
  };

  /** Cancels the loop and clears all callbacks. */
  export const terminate = (): void => {
    console.debug("AnimationFrame terminate");
    nonrecurring.clear();
    recurring.clear();
    queue.length = 0;
    cancelAnimationFrame(id);
  };
}

/** Creates a `DeferExec` wrapper around `exec`. */
export const deferNextFrame = (exec: Exec): DeferExec => new DeferExec(exec);

/**
 * Utility class that defers execution of a function until the next animation
 * frame. Multiple requests before the frame are coalesced into one call.
 */
export class DeferExec implements Terminable {
  readonly #exec: Exec;

  #requested: boolean = false;
  #disabled: boolean = false;

  constructor(exec: Exec) {
    this.#exec = exec;
  }

  /** Request execution on the next animation frame. */
  readonly request = (): void => {
    if (this.#requested || this.#disabled) {
      return;
    }
    this.#requested = true;
    AnimationFrame.once(this.#fire);
  };

  /** Execute immediately, bypassing the next frame. */
  readonly immediate = (): void => {
    if (this.#disabled) {
      return;
    }
    this.#requested = true;
    this.#fire();
  };

  /** Cancel a pending request. */
  cancel(): void {
    this.#requested = false;
  }
  /** Disable the instance permanently. */
  terminate(): void {
    this.#disabled = true;
  }

  readonly #fire = (): void => {
    if (this.#disabled || !this.#requested) {
      return;
    }
    this.#requested = false;
    this.#exec();
  };
}
