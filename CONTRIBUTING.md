# Contributing to openDAW

Thank you for your interest in contributing to openDAW! This guide outlines the preferred workflow for submitting pull requests and the coding style that keeps the project consistent.

## Pipeline Overview

The monorepo uses **Turbo** to run build, test, and lint tasks across all packages. **Lerna** manages package versioning and publishing, while API docs are generated with **Typedoc**. Deployment configuration files for Vercel and Netlify describe how docs and apps would be deployed when enabled.

## Pull Request Workflow

1. **Fork and clone** the repository, then create a descriptive branch for your work.
2. **Install dependencies** with `npm install` and make sure the project builds locally.
3. **Keep commits focused** and write clear commit messages that describe the change.
4. **Format and lint** your changes:
   - `npx prettier --write <files>`
   - `npm run lint`
5. **Run tests** before opening a PR:
   - `npm test`
6. **Push your branch** and open a pull request against `main`.
7. **Respond to review feedback** and keep the PR up to date with `main` if needed.

## Style Guidelines

- Use **Prettier** for formatting and **ESLint** for linting.
- Prefer clear, self-documenting code and avoid unnecessary abstractions.
- Write Markdown documentation using ATX headings (`#`, `##`, etc.) and keep line length reasonable.
- Include tests or documentation updates alongside code changes when appropriate.

Following these steps helps maintain a clean git history and a stable codebase. We appreciate every contribution—thank you for helping improve openDAW!
