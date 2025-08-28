/**
 * Lightweight command palette inspired overlay allowing quick execution of
 * actions by name.
 *
 * Integrates the {@link SearchInput} component to provide a draggable command
 * palette overlay.
 */
import css from "./Spotlight.sass?inline";
import {
  DefaultObservableValue,
  Nullable,
  Option,
  Point,
  Terminable,
  Terminator,
} from "@opendaw/lib-std";
import { StudioService } from "@/service/StudioService.ts";
import {
  appendChildren,
  createElement,
  replaceChildren,
} from "@opendaw/lib-jsx";
import { Icon } from "@/ui/components/Icon.tsx";
import { SearchInput } from "@/ui/components/SearchInput.tsx";
import { Surface } from "@/ui/surface/Surface.tsx";
import { IconSymbol } from "@opendaw/studio-adapters";
import { Dragging, Events, Html, Keyboard } from "@opendaw/lib-dom";

const className = Html.adoptStyleSheet(css, "Spotlight");

export namespace Spotlight {
  /**
   * Installs global keyboard shortcuts to toggle the spotlight view.
   *
   * @param surface Drawing surface used as the parent for the overlay.
   * @param service Application service providing data sources.
   * @returns Terminable subscription managing the shortcut listeners.
   */
  export const install = (
    surface: Surface,
    service: StudioService,
  ): Terminable => {
    const position = Point.create(surface.width / 2, surface.height / 3);
    let current: Nullable<HTMLElement> = null;
    return Terminable.many(
      Events.subscribe(
        surface.owner,
        "keydown",
        (event) => {
          const shiftEnter = event.shiftKey && event.code === "Enter";
          const cmdKeyF = Keyboard.isControlKey(event) && event.code === "KeyF";
          if (shiftEnter || cmdKeyF) {
            event.preventDefault();
            if (current === null) {
              const terminator = new Terminator();
              terminator.own({ terminate: () => (current = null) });
              current = (
                <View
                  terminator={terminator}
                  surface={surface}
                  service={service}
                  position={position}
                />
              );
            } else {
              current.blur();
              current
                ?.querySelectorAll<HTMLElement>("*")
                .forEach((element) => element.blur());
            }
          }
        },
        { capture: true },
      ),
    );
  };

  /** Props required to render the spotlight view. */
  type Construct = {
    /** Terminator controlling component cleanup. */
    terminator: Terminator;
    /** Surface on which the overlay is rendered. */
    surface: Surface;
    /** Access to services and command providers. */
    service: StudioService;
    /** Initial position of the overlay. */
    position: Point;
  };

  /**
   * Floating spotlight search box rendering component.
   *
   * @param terminator Aggregates disposables of the view.
   * @param surface Drawing surface hosting the overlay.
   * @param service Application service providing data sources.
   * @param position Initial position of the overlay.
   * @returns Root HTML element of the spotlight view.
   */
  export const View = ({
    terminator,
    surface,
    service,
    position,
  }: Construct): HTMLElement => {
    const query = new DefaultObservableValue("");
    const inputField: HTMLInputElement = SearchInput({
      lifecycle: terminator,
      model: query,
      placeholder: "Search anything...",
      style: {
        background: "none",
        boxShadow: "none",
        color: "inherit",
        fontSize: "inherit",
        fontWeight: "inherit",
        fontFamily: "inherit",
        padding: "0",
        width: "100%",
      },
    });
    const result: HTMLElement = <div className="result hidden" />;
    const element: HTMLElement = (
      <div className={className} tabindex={-1}>
        <header>
          <Icon symbol={IconSymbol.OpenDAW} />
          {inputField}
        </header>
        {result}
      </div>
    );
    const updatePosition = () =>
      (element.style.transform = `translate(${position.x}px, ${position.y}px)`);
    updatePosition();
    terminator.ownAll(
      Dragging.attach(element, ({ clientX, clientY }) => {
        const tx = position.x;
        const ty = position.y;
        return Option.wrap({
          update: (event: Dragging.Event) => {
            position.x = tx + event.clientX - clientX;
            position.y = ty + event.clientY - clientY;
            updatePosition();
          },
          cancel: () => {
            position.x = tx;
            position.y = ty;
            updatePosition();
          },
          finally: () => inputField.focus(),
        });
      }),
      query.subscribe((owner) => {
        const results = service.spotlightDataSupplier.query(owner.getValue());
        const hasResults = results.length === 0;
        result.classList.toggle("hidden", hasResults);
        replaceChildren(
          result,
          results.map(({ icon, name }) => (
            <div className="result-item">
              <Icon symbol={icon} />
              <span>{name}</span>
            </div>
          )),
        );
      }),
      Events.subscribe(inputField, "keydown", (event) => {
        if (event.code === "Enter") {
          const results = service.spotlightDataSupplier.query(query.getValue()); // TODO keep from last search
          if (results.length > 0) {
            results[0].exec();
            terminator.terminate();
          }
        } else if (event.code === "CursorDown") {
        }
      }),
      Events.subscribe(element, "focusout", (event: FocusEvent) => {
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) {
          terminator.terminate();
        } else if (relatedTarget instanceof Element) {
          if (
            !relatedTarget.contains(element) &&
            !element.contains(relatedTarget)
          ) {
            terminator.terminate();
          }
        }
      }),
      {
        terminate: () => {
          if (element.isConnected) {
            element.remove();
          }
        },
      },
    );
    requestAnimationFrame(() => {
      inputField.focus();
      inputField.select();
    });
    appendChildren(surface.flyout, element);
    return element;
  };
}
