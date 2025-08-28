# OpenDAW Studio

This package contains the web-based user interface for the OpenDAW project.
TSDoc comments throughout the codebase power the generated API reference for
plugin authors.
It uses a central colour system defined in
[`src/colors.sass`](src/colors.sass) and exposed through the
[design tokens](../../docs/docs-dev/style/design-tokens.md).

For a guided overview of the interface, see the [UI tour](../../docs/docs-user/ui-tour.md).
Guidance on saving and importing projects lives in the [file management guide](../../docs/docs-user/features/file-management.md). The [notepad feature](../../docs/docs-user/features/notepad.md) lets you store project notes using Markdown.
Developer details about project storage and sessions can be found in the [projects documentation](../../docs/docs-dev/projects/overview.md).

Project change history is captured in a SyncLog. Learn how to use it in the
[history workflow](../../docs/docs-user/workflows/history.md) and read about the
underlying [sync log architecture](../../docs/docs-dev/architecture/sync-log.md).

The capture subsystem for recording audio and MIDI is described in the
[capture architecture docs](../../docs/docs-dev/architecture/capture/overview.md).
Users can follow the [recording workflow guide](../../docs/docs-user/workflows/recording.md)
to learn how to capture takes.

Quickly launch commands using the Spotlight search palette with <kbd>Shift</kbd>+<kbd>Enter</kbd>. Read the [user guide](../../docs/docs-user/features/search.md) or see the [developer docs](../../docs/docs-dev/ui/spotlight/overview.md).
Exchange projects with other DAWs via the `.dawproject` format using the
[DAWproject workflow](../../docs/docs-user/workflows/dawproject.md). Implementation
details for developers live in the
[Studio serialization guide](../../docs/docs-dev/serialization/studio-dawproject.md).

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
Additional information is available for
[tracks](../../docs/docs-dev/ui/timeline/tracks.md),
[markers](../../docs/docs-dev/ui/timeline/markers.md) and the
[timeline footer](../../docs/docs-dev/ui/timeline/footer.md).
