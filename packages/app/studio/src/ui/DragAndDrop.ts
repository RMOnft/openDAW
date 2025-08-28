import {
  Arrays,
  Client,
  InaccessibleProperty,
  int,
  isDefined,
  Nullable,
  Option,
  Provider,
  Terminable,
} from "@opendaw/lib-std";
import { AnyDragData, DragFile } from "@/ui/AnyDragData";
import { Events, Keyboard } from "@opendaw/lib-dom";

/** Utilities for wiring DOM elements into the studio's drag and drop system. */
export namespace DragAndDrop {
  let dragging: Option<AnyDragData> = Option.None;

  /**
   * Tests whether the drag event carries native file data.
   *
   * @param event Drag event to inspect.
   * @returns `true` when the payload contains file information.
   */
  const hasFiles = (event: DragEvent): boolean => {
    const type = event.dataTransfer?.types?.at(0);
    return type === "Files" || type === "application/x-moz-file";
  };

  /**
   * Extracts `File` objects from a drag event when available.
   *
   * @param event Drag event to inspect.
   * @returns Array of files or an empty array.
   */
  const extractFiles = (event: DragEvent): ReadonlyArray<File> => {
    const dataTransfer = event.dataTransfer;
    if (!isDefined(dataTransfer)) {
      return Arrays.empty();
    }
    if (hasFiles(event)) {
      return Array.from(dataTransfer.files);
    }
    return Arrays.empty();
  };

  /**
   * Makes the given element a drag source.
   *
   * @param element      The DOM element that initiates the drag.
   * @param provider     Supplies drag data when the drag starts.
   * @param classReceiver Optional element that receives the `dragging` CSS class.
   * @returns Terminable subscription managing the listeners.
   */
  export const installSource = (
    element: HTMLElement,
    provider: Provider<AnyDragData>,
    classReceiver?: Element,
  ): Terminable => {
    classReceiver ??= element;
    element.draggable = true;
    return Terminable.many(
      Events.subscribe(element, "dragend", () => {
        classReceiver.classList.remove("dragging");
        dragging = Option.None;
      }),
      Events.subscribe(element, "dragstart", (event: DragEvent) => {
        const dataTransfer = event.dataTransfer;
        if (!isDefined(dataTransfer)) {
          return;
        }
        dataTransfer.setData("application/json", "{custom: true}");
        dataTransfer.effectAllowed = "copyMove";
        classReceiver.classList.add("dragging");
        dragging = Option.wrap(provider());
      }),
    );
  };

  /** Callbacks describing the drop target behaviour. */
  export interface Process {
    /**
     * Called during `dragover`/`dragenter` to determine whether dropping is allowed.
     *
     * @param event Native drag event.
     * @param dragData Data supplied by the drag source.
     * @returns `true` when a drop should be permitted.
     */
    drag(event: DragEvent, dragData: AnyDragData): boolean;
    /**
     * Called when a drop happens and `drag` returned true.
     *
     * @param event Native drag event.
     * @param dragData Data supplied by the drag source.
     */
    drop(event: DragEvent, dragData: AnyDragData): void;
    /** Invoked when the first dragged item enters the target. */
    enter(allowDrop: boolean): void;
    /** Invoked when the dragged item leaves the target or the operation ends. */
    leave(): void;
  }

  /**
   * Registers the element as a drop target.
   *
   * @param element The DOM node that accepts drops.
   * @param process Callbacks defining drop behaviour.
   * @returns Terminable subscription managing the listeners.
   */
  export const installTarget = (
    element: HTMLElement,
    process: Process,
  ): Terminable => {
    let count: int = 0 | 0;
    return Terminable.many(
      Events.subscribe(element, "dragenter", (event: DragEvent) => {
        if (count++ === 0) {
          process.enter(
            dragging.match({
              none: () =>
                hasFiles(event) &&
                process.drag(event, {
                  type: "file",
                  file: InaccessibleProperty(
                    "Cannot access file while dragging",
                  ),
                }),
              some: (data) => process.drag(event, data),
            }),
          );
        }
      }),
      Events.subscribe(element, "dragover", (event: DragEvent) => {
        const dataTransfer = event.dataTransfer;
        if (!isDefined(dataTransfer)) {
          return;
        }
        dragging.match({
          none: () => {
            if (
              hasFiles(event) &&
              process.drag(event, {
                type: "file",
                file: InaccessibleProperty("Cannot access file while dragging"),
              })
            ) {
              event.preventDefault();
              dataTransfer.dropEffect = "copy";
            }
          },
          some: (data) => {
            if (process.drag(event, data)) {
              event.preventDefault();
              dataTransfer.dropEffect =
                Keyboard.isCopyKey(event) || data.copy === true
                  ? "copy"
                  : "move";
            }
          },
        });
      }),
      Events.subscribe(element, "dragleave", (_event: DragEvent) => {
        if (--count === 0) {
          process.leave();
        }
      }),
      Events.subscribe(element, "drop", (event: DragEvent) => {
        dragging.match({
          none: () => {
            const files = extractFiles(event);
            if (files.length === 0) {
              return;
            }
            const data: DragFile = { type: "file", file: files[0] };
            if (process.drag(event, data)) {
              event.preventDefault();
              process.drop(event, data);
              dragging = Option.None;
            }
          },
          some: (data) => {
            if (process.drag(event, data)) {
              event.preventDefault();
              process.drop(event, data);
              dragging = Option.None;
            }
          },
        });
        if (count > 0) {
          process.leave();
          count = 0;
        }
      }),
      Events.subscribe(element, "dragend", (_event: DragEvent) => (count = 0), {
        capture: true,
      }),
    );
  };

  /**
   * Computes the insertion index for a dragged item within a parent element.
   * Children participating in the calculation must carry the `data-drag` attribute.
   *
   * @param client Pointer coordinates of the drag.
   * @param parent Container whose children are examined.
   * @param limit Optional index range limiting the search.
   * @returns Tuple of desired index and the element currently at that slot.
   */
  export const findInsertLocation = (
    { clientX }: Client,
    parent: Element,
    limit?: [int, int],
  ): [int, Nullable<Element>] => {
    const elements = Array.from(parent.querySelectorAll("[data-drag]"));
    const [minIndex, maxIndex] = limit ?? [0, elements.length];
    let index: int = minIndex;
    while (true) {
      const child = elements[index] ?? null;
      if (index >= maxIndex) {
        return [index, child];
      }
      const rect = child.getBoundingClientRect();
      const center = (rect.left + rect.right) / 2;
      if (clientX < center) {
        return [index, child];
      }
      index++;
    }
  };
}
