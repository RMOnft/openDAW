# Contributing to openDAW

Thank you for your interest in contributing to openDAW! This guide outlines the preferred workflow for submitting pull requests and the coding style that keeps the project consistent.

## Pipeline Overview

The monorepo uses **Turbo** to run build, test, and lint tasks across all
packages. **Lerna** manages package versioning and publishing; see the
[versioning policy](packages/docs/docs-dev/build-and-run/versioning.md). API
docs are generated with **Typedoc**. Deployment configuration files for Vercel
and Netlify describe how docs and apps would be deployed when enabled. For a
high-level view of application start-up and recovery, refer to the
[bootstrapping guide](packages/docs/docs-dev/architecture/bootstrap.md).

GitHub Actions provides continuous integration. Workflows handle deployment,
documentation builds, quality checks, Discord notifications, and SFTP tests.
Although disabled, they document the intended automation. See the
[CI guide](packages/docs/docs-dev/build-and-run/ci.md) for more details.

## Configuration Overview

Repository-level config files define linting, build tasks, documentation output,
and deployment samples:

- `.eslintrc.js` – root ESLint setup.
- `.markdownlint.yml` – Markdown lint defaults.
- `.vale.ini` – prose style rules.
- `turbo.json` – task orchestration across packages.
- `lerna.json` – package publishing defaults.
- `typedoc.json` – API docs generation settings.
- `package.json` & `package-lock.json` – workspace manifests.
- `netlify.toml` & `vercel.json` – deployment examples.
- `.gitignore` – files excluded from git.

## Pull Request Workflow

1. **Fork and clone** the repository, then create a descriptive branch for your work.
2. **Install dependencies**:
   - `npm run install:deps` to install required system tools.
   - `npm install` to fetch project packages.
3. **Keep commits focused** and write clear commit messages that describe the change.
4. **Format and lint** your changes:
   - `npx prettier --write <files>`
   - `npm run lint`
5. **Run tests** before opening a PR:
   - `npm test`
6. **Push your branch** and open a pull request against `main`.
7. **Respond to review feedback** and keep the PR up to date with `main` if needed.

## Style Guidelines

- Use **Prettier** for formatting and **ESLint** for linting. See the
  [ESLint configuration guide](./packages/docs/docs-dev/configuration/eslint.md).
- Prefer clear, self-documenting code and avoid unnecessary abstractions.
- Write Markdown documentation using ATX headings (`#`, `##`, etc.) and keep line length reasonable.
- Include tests or documentation updates alongside code changes when appropriate.
- Review our [error handling notes](packages/docs/docs-dev/error-handling.md) when working with runtime failures.
- Refer to the [Writing Guide](packages/docs/docs-dev/style/writing-guide.md) for tone and formatting tips when updating documentation.

Following these steps helps maintain a clean git history and a stable codebase. We appreciate every contribution—thank you for helping improve openDAW!

## Useful Scripts

- `npm run clean` – remove build artifacts and dependencies.
- `npm run cert` – regenerate the HTTPS development certificate.
