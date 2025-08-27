# OpenDAW Studio

This package contains the web-based user interface for the OpenDAW project.

For a guided overview of the interface, see the [UI tour](../../docs/docs-user/ui-tour.md).
Guidance on saving and importing projects lives in the [file management guide](../../docs/docs-user/features/file-management.md). The [notepad feature](../../docs/docs-user/features/notepad.md) lets you store project notes using Markdown.
Developer details about project storage and sessions can be found in the [projects documentation](../../docs/docs-dev/projects/overview.md).

The project notepad uses markdown and can be customized. See the
[markdown editing guide](../../docs/docs-dev/ui/markdown/editing.md) for
developer details. For instructions on using the feature in the Studio,
read the [notepad user guide](../../docs/docs-user/features/notepad.md).

Menu commands are built from a hierarchical `MenuItem` model. See the
[menu overview](../../docs/docs-dev/ui/menu/overview.md) for how menus and
keyboard shortcuts are wired into the Studio.

For individual topics, browse the in-app [manuals](public/manuals/index.md).

## Component Hierarchy

![Component hierarchy](../../../assets/ui/component-hierarchy.svg)
Developers can extend the Studio with custom devices and user interfaces. Learn how to build and test plugins in the [developer docs](../../docs/docs-dev/extending/plugin-guide.md).

## Custom Workspace Pages

The workspace layout is defined in `src/ui/workspace`. New screens can be added by extending `Workspace.Default` with additional layout trees or by supplying a custom configuration. Each screen is rendered by `WorkspacePage`, which builds the panel hierarchy at runtime.
For implementation details on the timeline, see the developer docs for
[clips](../../docs/docs-dev/ui/timeline/clips.md) and
[regions](../../docs/docs-dev/ui/timeline/regions.md).
