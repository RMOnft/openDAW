/**
 * Warning emission helpers.
 */
export class Warning extends Error {}

/**
 * Throws a {@link Warning} with the given message.
 *
 * This utility allows signalling non-fatal issues that should surface to the
 * user but are handled differently from regular errors.
 */
export const warn = (issue: string): never => {
  throw new Warning(issue);
};
