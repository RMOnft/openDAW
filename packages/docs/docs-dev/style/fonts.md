# Fonts

The studio bundles its fonts in [`packages/app/studio/public/fonts`](../../../packages/app/studio/public/fonts).

- `rubik.woff2` – Rubik (SIL Open Font License 1.1).
- `OpenSans-Regular.ttf` – Open Sans (SIL Open Font License 1.1).

Fonts are declared in [`src/ui/Fonts.ts`](../../../packages/app/studio/src/ui/Fonts.ts) and loaded at runtime by `FontLoader`.

When adding or replacing fonts:

1. Add the font file to `public/fonts`.
2. Register it in `src/ui/Fonts.ts`.
3. Document its origin and license in [`public/fonts/README.md`](../../../packages/app/studio/public/fonts/README.md).
