/**
 * Project management operations such as creating, opening and saving
 * projects.
 *
 * @public
 */
export interface ProjectAPI {
  /**
   * Create a new project.
   * @param name - Human readable project name.
   */
  create(name: string): Promise<void>;

  /**
   * Save the current project.
   * @returns Resolves when the project has been written to storage.
   */
  save(): Promise<void>;

  /**
   * Load a project by identifier.
   * @param id - Identifier of the project to load.
   */
  load(id: string): Promise<void>;

  /**
   * Close the active project and release resources.
   */
  close(): void;
}
