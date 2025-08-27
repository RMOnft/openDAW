# Markdown Editing

OpenDAW uses markdown to format rich text such as the project notepad. The
`renderMarkdown` helper converts markdown to HTML and augments the output
with platform specific tweaks.

## Renderer behaviour

- Rewrites modifier key symbols so shortcut references match the host OS.
- Ensures images are CORS friendly and limited to the container width.
- Routes internal links through the app router and opens external links in
  a new tab.
- Makes code blocks clickable to copy their contents to the clipboard.

## Notepad integration

The [notepad panel](../../../docs-user/features/notepad.md) stores its
contents as markdown. When edit mode is active the panel exposes a plain
text area. Leaving edit mode re-renders the text as markdown and persists it
to the session metadata.
