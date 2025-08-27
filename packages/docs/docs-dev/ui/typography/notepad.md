---
title: Notepad Panel
---

The workspace exposes a Markdown based notepad implemented in
[`src/ui/NotePadPanel.tsx`](../../../../../app/studio/src/ui/NotePadPanel.tsx).

The panel toggles between edit and preview modes. In edit mode the content is
plain text, limited to 10&nbsp;000 characters, and persisted to the current
session's metadata on blur or explicit save. Preview mode renders the text using
the shared `renderMarkdown` helper.

