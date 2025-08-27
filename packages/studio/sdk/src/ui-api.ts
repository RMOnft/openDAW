/**
 * Allows host applications to contribute user interface components or dialogs.
 *
 * @public
 */
export interface UiAPI {
  /**
   * Register a custom component that can be used by the studio.
   *
   * @param name - Unique component identifier.
   * @param factory - Function that creates the component instance.
   */
  registerComponent(name: string, factory: () => unknown): void;

  /**
   * Open a modal dialog within the host application.
   *
   * @param title - Dialog title.
   * @param content - Arbitrary content or configuration for the dialog.
   */
  openDialog(title: string, content: unknown): Promise<void>;
}
