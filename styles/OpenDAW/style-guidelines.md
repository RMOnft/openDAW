# OpenDAW Style Guidelines

This document outlines the conventions used for CSS and Sass across the project.

## Variables

- CSS custom properties use kebab-case and live in `packages/app/studio/src/colors.sass`.
- Color values use the `--color-*` prefix, e.g. `--color-blue` or `--color-green`.
- Layout constants follow the same pattern such as `--lane-height` and `--timeline-header-width`.
- Panel backgrounds are available via `--panel-background`, `--panel-background-bright`, and `--panel-background-dark`.
- Group related variables together and document new entries when introduced.

## Naming

- Class names, mixins, and variables use kebab-case (`.help-section`, `@mixin width-available`).
- Avoid camelCase and underscores in selectors and custom properties.
- Asset filenames in `packages/app/studio/public` also follow kebab-case.
- Style assets include comments or metadata pointing back to this guide.

The following files demonstrate these conventions:

- `packages/app/headless/src/style.css`
- `packages/app/studio/src/main.sass`
- `packages/app/studio/src/mixins.sass`
- `packages/app/studio/src/colors.sass`
- `packages/app/studio/public` assets
