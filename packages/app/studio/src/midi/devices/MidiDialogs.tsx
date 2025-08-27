/** Dialog components for MIDI device workflows. */
import { createElement } from "@opendaw/lib-jsx";
import { Dialog, DialogHandler } from "@/ui/components/Dialog";
import { IconSymbol } from "@opendaw/studio-adapters";
import { Surface } from "@/ui/surface/Surface";
import { Exec } from "@opendaw/lib-std";

/** Dialog helpers related to MIDI device interactions. */
export namespace MidiDialogs {
  /**
   * Show an instructional dialog for learning MIDI key connections.
   * The provided callback is invoked if the user cancels the dialog.
   */
  export const showInfoDialog = (cancel: Exec): DialogHandler => {
    const dialog: HTMLDialogElement = (
      <Dialog
        headline={"Learn Midi Keys..."}
        icon={IconSymbol.DinSlot}
        cancelable={true}
        buttons={[
          {
            text: "Cancel",
            primary: false,
            onClick: (handler) => {
              handler.close();
              cancel();
            },
          },
        ]}
      >
        <div style={{ padding: "1em 0" }}>
          <p>Hit a key on your midi-device to learn a connection.</p>
        </div>
      </Dialog>
    );
    Surface.get().body.appendChild(dialog);
    dialog.showModal();
    return dialog;
  };
}
