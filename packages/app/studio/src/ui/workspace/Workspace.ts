import { PanelType } from "@/ui/workspace/PanelType.ts";
import { PanelState } from "@/ui/workspace/PanelState.ts";
import { DefaultWorkspace } from "@/ui/workspace/Default.ts";
import { IconSymbol } from "@opendaw/studio-adapters";

/**
 * Namespace that groups together all types used by the workspace layout
 * system. A workspace is described by nested layouts and panels that are
 * arranged either horizontally or vertically. The `Default` export provides
 * the built-in set of screens used by the Studio.
 */
export namespace Workspace {
  /**
   * A single screen that can be selected by the user. Each screen hosts a
   * content tree describing the panel layout.
   */
  export type Screen = {
    name: string;
    icon: IconSymbol;
    content: Content;
    hidden?: true;
  };

  /**
   * Constrains for a flex sized panel. The `flex` value is used as the flex
   * grow weight and the optional `maxSize` limits the expansion.
   */
  export type FlexLayoutConstrains = {
    type: "flex";
    minSize: number;
    maxSize?: number;
    flex: number;
  };

  /** Constrains for a fixed sized panel measured in pixels. */
  export type FixedLayoutConstrains = {
    type: "fixed";
    fixedSize: number;
  };

  /** Union of possible sizing constrains for a panel or layout. */
  export type LayoutConstrains = FlexLayoutConstrains | FixedLayoutConstrains;

  /**
   * Describes a nested layout that groups multiple contents either
   * horizontally or vertically.
   */
  export type LayoutConfig = {
    type: "layout";
    orientation: Orientation;
    contents: Array<Content>;
    constrains: LayoutConstrains;
  };

  /** Configuration for a single panel instance within a layout. */
  export type PanelConfig = {
    minimized?: true;
    notMinimizable?: true;
    notPopoutable?: true;
    type: "panel";
    name: string;
    icon: IconSymbol;
    panelType: PanelType;
    constrains: LayoutConstrains;
  };

  /** Orientation used by nested layouts. */
  export type Orientation = "horizontal" | "vertical";

  /** Content type that can either be a panel or another layout. */
  export type Content = PanelState | LayoutConfig;

  /** Built-in workspace configuration used by the Studio. */
  export const Default = DefaultWorkspace satisfies Record<string, Screen>;
  export type ScreenKeys = keyof typeof DefaultWorkspace;
}
