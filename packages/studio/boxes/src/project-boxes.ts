/**
 * Project level box definitions describing DAW projects.
 *
 * @packageDocumentation
 */

/** Placeholder project box definition. */
export interface ProjectBox {
  /** File name for the project. */
  file: string;
}

/** Registered project box definitions. */
export const projectBoxes: ProjectBox[] = [];
