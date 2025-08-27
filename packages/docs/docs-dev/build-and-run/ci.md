# Continuous Integration

GitHub Actions drives the repository's CI pipeline. The disabled workflows in
`.github/workflows` illustrate how automation will eventually run:

- `deploy.yml` – uploads the built studio via SFTP.
- `deploy-docs.yml` – publishes documentation to GitHub Pages.
- `docs.yml` – builds documentation and verifies links.
- `docs-quality.yml` – lints Markdown and checks prose.
- `discord.yml` – sends notifications to Discord.
- `test-sftp.yml` – checks SFTP credentials.

The diagram below shows the basic CI flow from commit to deployment.

![CI flow diagram](../../../../assets/architecture/ci-flow.svg)
