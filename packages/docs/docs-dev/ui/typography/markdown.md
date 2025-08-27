---
title: Markdown Rendering
---

[`src/ui/Markdown.tsx`](../../../../../app/studio/src/ui/Markdown.tsx) wraps the
[`markdown-it`](https://github.com/markdown-it/markdown-it) parser with a few
convenience features:

- Internal links are captured and routed through the application's navigation
  system.
- Images are constrained to the container width and marked as anonymous for
  proper CORS handling.
- Code blocks become clickable and copy their contents to the clipboard.

The same renderer powers the in‑app manuals and the workspace notepad.

