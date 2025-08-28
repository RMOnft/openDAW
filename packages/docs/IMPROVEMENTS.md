# Documentation Improvement Plan

This document outlines follow-up work needed to move the openDAW documentation site toward professional quality. Items are grouped by area and can be addressed incrementally.

## Broken Links and Anchors

- Resolve all links reported during `npm run docs:build` such as references to `/docs/api`, `ROADMAP.md` and various developer guides.
- Validate internal anchors (e.g. `/docs/dev/package-inventory#lib`) and update or remove outdated references.
- Introduce automated link checking (e.g. `docusaurus-lint` or `markdown-link-check`) in CI to prevent regressions.

## MDX and Content Issues

- Replace remaining JSDoc style tags (`{@code ...}`) with Markdown or MDX equivalents.
- Audit Markdown files for MDX syntax errors; add tests or linting to catch them earlier.
- Fill placeholder content (e.g. search config, API references) and ensure all examples compile.

## Site Configuration

- Configure Algolia search with real `appId` and `apiKey` or remove the placeholder until ready.
- Review Node.js engine requirement (`>=23`) and align with an available LTS version to ease local development.
- Provide a pre-build step or workspace script so `docs:build` automatically compiles required packages like `lib-std` and `lib-dsp`.

## Documentation Structure

- Organize Developer, User, and Learning sections with consistent style guides and navigation.
- Add landing pages or overview topics where currently missing.
- Ensure API docs include cross-links from guides and vice versa for discoverability.

## Testing and CI

- Add a dedicated CI job to build the docs site and fail on warnings.
- Consider snapshot tests or visual regression tools for critical documentation pages.

Addressing these areas will improve the reliability and professionalism of the openDAW documentation site.
