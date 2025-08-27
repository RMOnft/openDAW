# openDAW Roadmap

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

- Publish core documentation set and initial diagrams.
- Define documentation ownership and review process.
- Run continuous integration for tests and linting.

## Mid term

- Launch internationalization workflow for community translations.
- Integrate accessibility tooling and audits.
- Version documentation alongside the first stable release.

## Long term

- Support additional languages and downloadable offline docs.
- Provide real-time collaborative editing for documentation.
- Evolve roadmap based on community feedback.

Roadmap items are tentative and may change as the project evolves.
