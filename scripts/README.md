# Scripts

Utility scripts that help manage the development environment.

| Script | Description | Usage |
| ------ | ----------- | ----- |
| `cert.sh` | Generate a trusted HTTPS certificate for `localhost` using [`mkcert`](https://github.com/FiloSottile/mkcert). | `npm run cert` |
| `clean.sh` | Remove all `node_modules`, build outputs, lock files and Turbo caches to reset the workspace. | `npm run clean` |
| `install_dependencies.js` | Check for required system tools (Git, Node.js, mkcert, Sass, TypeScript, OpenSSL) and install any missing ones. Also runs `npm install`. | `npm run install:deps` |

