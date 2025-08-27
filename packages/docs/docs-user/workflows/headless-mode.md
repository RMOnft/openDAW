---
sidebar_position: 5
---

# Headless mode

The headless build runs openDAW in the browser without rendering any UI. It is
useful for automated testing or embedding openDAW as an audio engine.

1. `npm install` in `packages/app/headless`.
2. `npm run dev` and navigate to `http://localhost:8080`.
3. Click the page to start playback of the example project.

The build loads `src/main.ts`, which in turn creates a project from code using
`createExampleProject` and bootstraps the audio engine. See the package README
for more details.


This demo uses the same sample management API and core engine as the Studio service, providing feature parity for audio processing. See the [headless vs studio comparison](../../docs-dev/architecture/headless-vs-studio.md) for architectural details.

