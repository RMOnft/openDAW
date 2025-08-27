import { Workspace } from "@/ui/workspace/Workspace.ts";

/**
 * Maps the workspace orientation to DOM property names used for pointer
 * positions and element sizing. This allows layout code to be agnostic of the
 * current axis.
 */
export const AxisProperty = {
  horizontal: {
    pointer: "clientX",
    size: "clientWidth",
    minStyle: "minWidth",
    maxStyle: "maxWidth",
  },
  vertical: {
    pointer: "clientY",
    size: "clientHeight",
    minStyle: "minHeight",
    maxStyle: "maxHeight",
  },
} as const satisfies Record<
  Workspace.Orientation,
  Record<string, keyof Element | keyof MouseEvent | keyof CSSStyleDeclaration>
>;
