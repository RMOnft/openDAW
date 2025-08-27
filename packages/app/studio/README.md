# OpenDAW Studio

This package contains the web-based user interface for the OpenDAW project.

For a guided overview of the interface, see the [UI tour](../../docs/docs-user/ui-tour.md).

## Component Hierarchy

![Component hierarchy](../../../assets/ui/component-hierarchy.svg)
Developers can extend the Studio with custom devices and user interfaces. Learn how to build and test plugins in the [developer docs](../../docs/docs-dev/extending/plugin-guide.md).

## Custom Workspace Pages

The workspace layout is defined in `src/ui/workspace`. New screens can be added by extending `Workspace.Default` with additional layout trees or by supplying a custom configuration. Each screen is rendered by `WorkspacePage`, which builds the panel hierarchy at runtime.
