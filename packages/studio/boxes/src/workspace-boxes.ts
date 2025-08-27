/**
 * Workspace level box definitions controlling global state.
 *
 * @packageDocumentation
 */

/** Placeholder workspace box definition. */
export interface WorkspaceBox {
  /** Title of the workspace. */
  title: string;
}

/** Workspace box collection used by the application. */
export const workspaceBoxes: WorkspaceBox[] = [];
