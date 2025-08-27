import { Box } from "@opendaw/lib-box";
import { MenuItem } from "@/ui/model/menu-item.ts";
import { showDebugBoxDialog } from "@/ui/components/dialogs.tsx";

/**
 * Menu helpers exposing development diagnostics.
 */
export namespace DebugMenus {
  /**
   * Creates a menu item that opens a dialog showing detailed information
   * about a given box.
   *
   * @param box - The box to inspect.
   * @param separatorBefore - Whether to insert a separator before the item.
   */
  export const debugBox = (box: Box, separatorBefore: boolean = true) =>
    MenuItem.default({
      label: "Debug Box",
      separatorBefore,
    }).setTriggerProcedure(() => showDebugBoxDialog(box));
}
