import {MenuItem, MenuRootData} from "@/ui/model/menu-item.ts"

/**
 * Aggregates the root menu items used by timeline editors. Editors can
 * contribute additional menu entries to the "view" and "edit" groups
 * to integrate with the surrounding application menus.
 */
export interface EditorMenuCollector {
    /** Root menu for view related actions. */
    viewMenu: MenuItem<MenuRootData>
    /** Root menu for edit related actions. */
    editMenu: MenuItem<MenuRootData>
}