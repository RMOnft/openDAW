# openDAW Roadmap

The roadmap outlines current and future work on openDAW. For an overview of the
project and how to get involved, see the [README](README.md) and
[CONTRIBUTING](CONTRIBUTING.md) guides.

## Milestones

- **Developer documentation** – [Intro](packages/docs/docs-dev/intro.md),
  [Architecture overview](packages/docs/docs-dev/architecture/overview.md),
  [API coverage](packages/docs/docs-dev/api-coverage.md),
  [Package inventory](packages/docs/docs-dev/package-inventory.md),
  [Build and run roadmap](packages/docs/docs-dev/build-and-run/roadmap.md).
- **User documentation** – [User guide](packages/docs/docs-user/intro.md) and
  [Quick start](packages/docs/docs-user/quick-start.md).
- **Learning resources** – [Learning hub](packages/docs/docs-learn/intro.md)
  and [DAW Basics 101](packages/docs/docs-learn/daw-basics-101.md).

## Pipeline Overview

Turbo coordinates workspace tasks such as builds, tests, and documentation
generation, while Lerna handles package versioning and publishing; see the
[versioning policy](packages/docs/docs-dev/build-and-run/versioning.md).
Deployment configs for Vercel and Netlify document how releases will be
delivered.

### Configuration Overview

The repository root contains shared configuration files:

- `.eslintrc.js` – lint rules.
- `.markdownlint.yml` – Markdown standards.
- `.vale.ini` – prose linting.
- `turbo.json` – task runner config.
- `lerna.json` – package management settings.
- `typedoc.json` – API doc options.
- `package.json` & `package-lock.json` – workspace manifests.
- `netlify.toml` & `vercel.json` – example deployment configs.
- `.gitignore` – ignored files list.

## Near term

- Publish core documentation set and initial diagrams – see the
  [developer docs](packages/docs/docs-dev/intro.md).
- Define documentation ownership and review process – see
  [CONTRIBUTING](CONTRIBUTING.md).
- Run continuous integration for tests and linting – follow the
  [CI guide](packages/docs/docs-dev/build-and-run/ci.md).

## Mid term

- Launch internationalization workflow for community translations – see the
  [Localization guide](packages/docs/docs-user/localization.md).
- Integrate accessibility tooling and audits – reference the
  [Accessibility guide](packages/docs/docs-user/accessibility.md).
- Version documentation alongside the first stable release – follow the
  [versioning policy](packages/docs/docs-dev/build-and-run/versioning.md).

## Long term

- Support additional languages and downloadable offline docs – expand the
  [Localization guide](packages/docs/docs-user/localization.md).
- Provide real-time collaborative editing for documentation – continue the
  [collaboration workflow](packages/docs/docs-user/workflows/collaboration.md).
- Evolve roadmap based on community feedback – share ideas via the
  [community channels](README.md).

Roadmap items are tentative and may change as the project evolves.
