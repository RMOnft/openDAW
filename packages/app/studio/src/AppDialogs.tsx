/**
 * Dialog helpers shown during application start-up.
 *
 * The exported functions are invoked from `main.ts` to request
 * browser-specific permissions that keep data available across sessions.
 */
import {Dialog} from "@/ui/components/Dialog"
import { IconSymbol } from "@opendaw/studio-adapters"
import {Surface} from "@/ui/surface/Surface"
import {Promises} from "@opendaw/lib-runtime"
import {createElement} from "@opendaw/lib-jsx"
import {Colors} from "@opendaw/studio-core"

/**
 * Opens a warning dialog asking Firefox users to persist storage.
 *
 * Firefox does not enable persistent storage by default which can lead to
 * data loss when the browser decides to clear storage. The dialog guides the
 * user to enable the permission and resolves once storage persistence is
 * granted.
 */
export const showStoragePersistDialog = (): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers<void>();
  // Construct the dialog element with a single "Allow" button
  const dialog: HTMLDialogElement = (
    <Dialog
      headline="Firefox Must Allow Storage Access"
      icon={IconSymbol.System}
      cancelable={false}
      buttons={[
        {
          text: "Allow",
          primary: true,
          onClick: (handler) =>
            Promises.tryCatch(navigator.storage.persist()).then(
              ({ status, value }) => {
                if (status === "resolved" && value) {
                  console.debug("Firefox now persists storage.");
                  handler.close();
                  resolve();
                }
              },
            ),
        },
      ]}
    >
      <div style={{ padding: "1em 0" }}>
        <h2 style={{ color: Colors.red }}>
          Data loss is probable if you do not take action.
        </h2>
        <p>To make this a permanent friendship, please go to:</p>
        <p style={{ color: Colors.yellow }}>
          Preferences - Privacy & Security - Cookies & Site Data - Manage
          Exceptions...
        </p>
        <p>
          and add opendaw.studio to the list. You will never be bothered again.
        </p>
      </div>
    </Dialog>
  );
  // Display the modal and return a promise that resolves once the user
  // grants persistence or dismisses the dialog.
  Surface.get().body.appendChild(dialog);
  dialog.showModal();
  return promise;
};
