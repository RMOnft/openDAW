import {Box} from "@opendaw/lib-box"
import {MenuItem} from "@/ui/model/menu-item.ts"
import {showDebugBoxDialog} from "@/ui/components/dialogs.tsx"

/**
 * Helpers for constructing debugging related menu entries.
 *
 * @see ../../../../../docs/docs-dev/ui/menu/debug.md
 */
export namespace DebugMenus {
    export const debugBox = (box: Box, separatorBefore: boolean = true) =>
        MenuItem.default({label: "Debug Box", separatorBefore}).setTriggerProcedure(() => showDebugBoxDialog(box))
}
