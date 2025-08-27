import css from "./NotePadPanel.sass?inline";
import template from "./NotePadTemplate.md?raw";
import { createElement } from "@opendaw/lib-jsx";
import { DefaultObservableValue, Lifecycle } from "@opendaw/lib-std";
import { StudioService } from "@/service/StudioService";
import { Icon } from "@/ui/components/Icon";
import { IconSymbol } from "@opendaw/studio-adapters";
import { Checkbox } from "@/ui/components/Checkbox";
import { renderMarkdown } from "@/ui/Markdown";
import { Events, Html, Keyboard } from "@opendaw/lib-dom";

/** CSS module class applied to the notepad container. */
const className = Html.adoptStyleSheet(css, "NotePadPanel");

/** Construction parameters for the {@link NotePadPanel} component. */
type Construct = {
  /** Parent lifecycle that manages subscriptions. */
  lifecycle: Lifecycle;
  /** Shared studio service used to persist notepad content. */
  service: StudioService;
};

/**
 * Displays a small markdown-capable notepad. The panel allows users to toggle
 * between editing plain text and viewing rendered markdown. Text is persisted
 * in the current session metadata.
 * Markdown based notepad embedded in the workspace.
 *
 * Allows users to jot down notes. Content is persisted in the session's
 * metadata under the key `notepad`.
 */
export const NotePadPanel = ({ lifecycle, service }: Construct) => {
  // Observable backing store for the markdown text.
  const markdownText = new DefaultObservableValue("");
  // Observable toggling between edit and preview modes.
  const editMode = new DefaultObservableValue(false);
  // Element representing the editable or rendered content.
  const notepad: HTMLElement = (
    <div className="content" role="region" aria-label="Notepad" />
  );
  // Persist the current notepad text into the session metadata.
  const saveNotepad = () => {
    const innerText = notepad.innerText;
    if (innerText === template) {
      return;
    }
    markdownText.setValue(innerText);
    service.session.updateMetaData("notepad", innerText);
  };
  // Re-render the notepad depending on edit mode state.
  const update = () => {
    Html.empty(notepad);
    const text = markdownText.getValue();
    if (editMode.getValue()) {
      notepad.textContent = text;
      notepad.setAttribute("contentEditable", "true");
      notepad.focus();
    } else {
      notepad.removeAttribute("contentEditable");
      renderMarkdown(notepad, text);
    }
  };
  if ((service.session.meta.notepad?.length ?? 0) > 0) {
    markdownText.setValue(service.session.meta.notepad!);
  } else {
    markdownText.setValue(template);
  }
  update();
  const element: Element = (
    <div className={className}>
      {notepad}
      <Checkbox
        lifecycle={lifecycle}
        model={editMode}
        style={{
          fontSize: "1rem",
          position: "sticky",
          top: "0.75em",
          right: "0.75em",
        }}
        appearance={{ cursor: "pointer" }}
        aria-label="Toggle edit mode"
      >
        <div style={{ display: "flex" }}>
          <Icon symbol={IconSymbol.EditBox} />
        </div>
      </Checkbox>
    </div>
  );
  lifecycle.ownAll(
    editMode.subscribe(() => {
      if (!editMode.getValue()) {
        saveNotepad();
      }
      update();
    }),
    Events.subscribe(element, "keydown", (event) => {
      if (
        editMode.getValue() &&
        Keyboard.isControlKey(event) &&
        event.code === "KeyS"
      ) {
        event.preventDefault();
        saveNotepad();
        service.save();
      }
    }),
    Events.subscribe(notepad, "blur", () => editMode.setValue(false)),
    Events.subscribe(notepad, "input", () =>
      Html.limitChars(notepad, "innerText", 10_000),
    ),
    {
      terminate: () => {
        if (editMode.getValue()) {
          saveNotepad();
        }
      },
    },
  );
  return element;
};
