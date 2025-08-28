# Code Splitting

The build pipeline uses Vite's Rollup integration to divide applications into
smaller chunks. Each chunk is given a UUID-based filename so browsers can cache
aggressively without loading stale code.

Key configuration files:

- `packages/app/studio/vite.config.ts` – sets `rollupOptions.output` to name
  entry and shared chunks.
- `packages/app/headless/vite.config.ts` – mirrors the studio settings for the
  headless demo.

Build tasks that invoke these configurations are orchestrated via
`turbo.json`.
