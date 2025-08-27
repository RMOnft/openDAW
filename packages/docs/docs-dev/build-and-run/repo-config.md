# Repository Configuration

This overview lists configuration files located at the root of the openDAW repository and their roles.

- `.eslintrc.js` – shared ESLint rules.
- `.markdownlint.yml` – default Markdown lint settings.
- `.vale.ini` – prose style guidelines used by Vale.
- `turbo.json` – task definitions for Turborepo.
- `lerna.json` – package publishing configuration.
- `typedoc.json` – base options for generating API documentation.
- `package.json` – workspace manifest, scripts, and dev dependencies.
- `package-lock.json` – placeholder lockfile; real one generated with `npm install`.
- `netlify.toml` – example Netlify deployment settings.
- `vercel.json` – example Vercel deployment settings.
- `.gitignore` – files and folders excluded from version control.

These files coordinate linting, documentation, builds, and deployment across the monorepo.
