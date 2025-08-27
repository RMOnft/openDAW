# Scripts

Helper scripts automate common setup tasks for the development environment.

## install_dependencies.js

Checks for required system tools and installs any that are missing, then runs
`npm install` for the workspace.

```bash
npm run install:deps
```

```mermaid
flowchart TD
  A[Start] --> B{Tool installed?}
  B -->|Yes| C[Next tool]
  B -->|No| D[Install tool]
  D --> B
  C --> E[Install npm packages]
```

## cert.sh

Generates a trusted HTTPS certificate for `localhost` using mkcert.

```bash
npm run cert
```

```mermaid
flowchart LR
  A[Run script] --> B[cd packages/app]
  B --> C[mkcert localhost]
```

## clean.sh

Removes build artifacts, lock files and `node_modules` to reset the workspace.

```bash
npm run clean
```

```mermaid
flowchart TD
  A[Run script] --> B[Remove node_modules]
  B --> C[Remove dist folders]
  C --> D[Delete lock files]
  D --> E[Clear .turbo caches]
  E --> F[Clean studio boxes]
```

