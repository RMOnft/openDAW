# Continuous Integration

The project uses **Turbo** tasks in continuous integration to verify builds,
linting, tests, and documentation generation. CI services execute commands such
as `turbo run lint`, `turbo run build`, and `turbo run test` to ensure
consistency across packages.

Deployment configuration files `vercel.json` and `netlify.toml` define how
previews or documentation could be deployed. These deployments are currently
disabled but provide a template for future automation.
