import { showInfoDialog } from "@/ui/components/dialogs.tsx";
import { Result, Validator } from "./validator";

/**
 * Validates that a name contains between 1 and 64 characters.
 *
 * @example
 * ```ts
 * NameValidator.validate("Project", {
 *   success: value => console.log(value),
 *   failure: () => console.error("Invalid name")
 * })
 * ```
 */
export const NameValidator: Validator<string> = {
  validate: (value: string, match: Result<string>, origin?: Element): void => {
    const trimmed = value.trim();
    if (trimmed.length >= 1 && trimmed.length <= 64) {
      match.success(trimmed);
    } else {
      match.failure?.();
      showInfoDialog({
        message: "A name must have one to 64 characters.",
        origin,
      });
    }
  },
};
