import css from "./TextTooltip.sass?inline";
import { Surface } from "./Surface";
import { createElement } from "@opendaw/lib-jsx";
import { Provider, Terminable } from "@opendaw/lib-std";
import { AbstractTooltip } from "@/ui/surface/AbstractTooltip.ts";
import { Events, Html } from "@opendaw/lib-dom";

/** Tooltip payload containing text content and screen coordinates. */
export interface Data {
  text: string;
  clientX: number;
  clientY: number;
}

/**
 * Simple text tooltip following the pointer.
 */
export class TextTooltip extends AbstractTooltip<Data> {
  /**
   * Attaches listeners that show the tooltip when the element is hovered or
   * pressed. The provider supplies the tooltip data.
   */
  static simple(element: Element, provider: Provider<Data>): Terminable {
    return Terminable.many(
      Events.subscribe(
        element,
        "pointerdown",
        () => {
          if (!this.enabled) {
            return;
          }
          const surface = Surface.get(element);
          surface.textTooltip.show(provider);
          Events.subscribe(
            element,
            "pointerleave",
            () => surface.textTooltip.hide(),
            { once: true },
          );
        },
        { capture: true },
      ),
      Events.subscribe(
        element,
        "pointerover",
        () => {
          if (!this.enabled) {
            return;
          }
          const surface = Surface.get(element);
          surface.textTooltip.show(provider);
          Events.subscribe(
            element,
            "pointerleave",
            () => surface.textTooltip.hide(),
            { once: true },
          );
        },
        { capture: true },
      ),
      Terminable.create(() => Surface.get(element).textTooltip.forceHide()),
    );
  }

  /**
   * Convenience helper showing a tooltip for plain string providers.
   */
  static default(element: Element, provider: Provider<string>): Terminable {
    return this.simple(element, () => {
      const clientRect = element.getBoundingClientRect();
      return {
        clientX: clientRect.left,
        clientY: clientRect.bottom + 8,
        text: provider(),
      };
    });
  }

  /** Global flag enabling or disabling all text tooltips. */
  static enabled: boolean = true;

  // DO NOT INLINE: This sheet needs to be initialized upfront to be copied over to new documents
  static readonly #CLASS_NAME = Html.adoptStyleSheet(css, "TextTooltip");

  constructor(surface: Surface) {
    super(surface);
  }

  protected createElement(): HTMLElement {
    return <div className={TextTooltip.#CLASS_NAME} />;
  }
  protected showDelayInFrames(): number {
    return 45;
  }
  protected hideDelayInFrames(): number {
    return 15;
  }

  /** Update tooltip text content. */
  update({ text }: Data): void {
    this.element.textContent = text;
  }
}
