import { PanelContentFactory } from "@/ui/workspace/PanelContents.tsx";
import { DomElement, replaceChildren } from "@opendaw/lib-jsx";
import { assert, Option, Terminable, Terminator, UUID } from "@opendaw/lib-std";
import { PanelType } from "@/ui/workspace/PanelType.ts";
import { PanelState } from "@/ui/workspace/PanelState.ts";
import { Surface } from "../surface/Surface";
import { showInfoDialog } from "@/ui/components/dialogs.tsx";
import { Html } from "@opendaw/lib-dom";

/**
 * Internal state stored when a panel is embedded into the workspace. It keeps
 * track of the panel's container and listener callbacks.
 */
export type PlaceHolder = {
  panelState: PanelState;
  container: DomElement;
  listener: PanelContentListener;
};

/** Listener notified when the panel changes its display state. */
export interface PanelContentListener {
  onEmbed(): void;
  onPopout(): void;
  onMinimized(): void;
}

/**
 * Handle returned from {@link PanelContent.bind} allowing the caller to
 * control and dispose the panel content.
 */
export interface PanelContentHandler extends Terminable {
  togglePopout(): void;
  toggleMinimize(): void;
  isPopout(): boolean;
}

/**
 * Helper responsible for creating and managing a panel's DOM content. It can
 * embed the panel in place, open it in a pop-out window, or minimize it while
 * preserving state.
 */
export class PanelContent {
  readonly #factory: PanelContentFactory;
  readonly #panelType: PanelType;

  readonly #terminator: Terminator;
  readonly #id: string;

  #placeholder: Option<PlaceHolder> = Option.None;

  constructor(factory: PanelContentFactory, panelType: PanelType) {
    this.#factory = factory;
    this.#panelType = panelType;

    this.#terminator = new Terminator();
    this.#id = UUID.toString(UUID.generate());
  }

  /**
   * Binds the panel content to a placeholder element and begins rendering it.
   * Returns a handler that can toggle pop-out/minimized states or terminate
   * the content.
   */
  bind(
    panelState: PanelState,
    container: DomElement,
    listener: PanelContentListener,
  ): PanelContentHandler {
    assert(
      this.#placeholder.isEmpty(),
      `Cannot have panel open in multiple location (${this.#placeholder.unwrapOrNull()?.panelState})`,
    );
    this.#placeholder = Option.wrap({ panelState, container, listener });
    if (this.isPopout) {
      listener.onPopout();
    } else if (panelState.isMinimized) {
      listener.onMinimized();
    } else {
      replaceChildren(
        container,
        this.#factory.create(this.#terminator, this.#panelType),
      );
      listener.onEmbed();
    }
    return {
      togglePopout: this.togglePopout.bind(this),
      toggleMinimize: this.toggleMinimize.bind(this),
      terminate: this.#onPlaceholderLeaves.bind(this),
      isPopout: (): boolean => this.isPopout,
    } satisfies PanelContentHandler;
  }

  get isPopout(): boolean {
    return Surface.getById(this.#id).nonEmpty();
  }
  get panelState(): Option<PanelState> {
    return this.#placeholder.map((placeholder) => placeholder.panelState);
  }

  /** Opens the panel in a separate window or embeds it back if already pop-out. */
  togglePopout(): void {
    if (this.#placeholder.isEmpty()) {
      console.debug("Cannot togglePopout. No Placeholder available.");
      return;
    }
    const { panelState, container, listener } = this.#placeholder.unwrap();
    if (!panelState.popoutable) {
      return;
    }
    if (this.isPopout) {
      this.#closePopout();
    } else {
      Surface.get()
        .new(640, 480, this.#id, panelState.name)
        .match({
          none: () => {
            showInfoDialog({
              message: "Could not open window. Check popup blocker?",
            });
          },
          some: (surface) => {
            this.#terminator.terminate();
            Html.empty(container);
            replaceChildren(
              surface.ground,
              this.#factory.create(this.#terminator, this.#panelType),
            );
            listener.onPopout();
            surface.own({
              terminate: () => {
                this.#terminator.terminate();
                Html.empty(surface.ground);
                this.#onSurfaceCloses();
              },
            });
          },
        });
    }
  }

  focusPopout(): void {
    Surface.getById(this.#id).ifSome((surface) => surface.owner.focus());
  }

  /** Minimizes the panel or restores it to the workspace. */
  toggleMinimize(): void {
    if (this.#placeholder.isEmpty()) {
      console.debug("Cannot toggleMinimize. No Placeholder available.");
      return;
    }
    const { panelState, container, listener } = this.#placeholder.unwrap();
    if (!panelState.minimizable) {
      return;
    }
    if (this.isPopout) {
      this.#closePopout();
    } else if (panelState.isMinimized) {
      replaceChildren(
        container,
        this.#factory.create(this.#terminator, this.#panelType),
      );
      panelState.isMinimized = false;
      listener.onEmbed();
    } else {
      this.#terminator.terminate();
      Html.empty(container);
      panelState.isMinimized = true;
      listener.onMinimized();
    }
  }

  #onPlaceholderLeaves(): void {
    const { container } = this.#placeholder.unwrap(
      "Illegal State Error (no placeholder)",
    );
    this.#placeholder = Option.None;
    if (!this.isPopout) {
      this.#terminator.terminate();
      Html.empty(container);
    }
  }

  #onSurfaceCloses(): void {
    if (this.#placeholder.isEmpty()) {
      // No placeholder available, so we do not care
      return;
    }
    const { panelState, container, listener } = this.#placeholder.unwrap();
    if (panelState.isMinimized) {
      listener.onMinimized();
    } else {
      replaceChildren(
        container,
        this.#factory.create(this.#terminator, this.#panelType),
      );
      panelState.isMinimized = false;
      listener.onEmbed();
    }
  }

  #closePopout(): void {
    Surface.getById(this.#id).ifSome((surface) => surface.close());
  }
}
