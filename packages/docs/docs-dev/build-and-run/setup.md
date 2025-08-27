# Setup

## Prerequisites

Before starting, install these tools:

- [Git](https://git-scm.com/) – used for cloning the repository and managing submodules.
- [mkcert](https://github.com/FiloSottile/mkcert#installation) – creates a local certificate for HTTPS development.
- [Node.js](https://nodejs.org/) **>= 23** – runs the development servers and installs dependencies.
- [Sass](https://sass-lang.com/) – ensure Sass binaries are available for style compilation.
- [TypeScript](https://www.typescriptlang.org/) – required for compiling TypeScript sources.
- [OpenSSL](https://openssl-library.org/) – needed for generating local development certificates (usually preinstalled).

## Steps

1. Clone the repository and change into the directory:
   ```bash
   git clone https://github.com/andremichelle/opendaw.git
   cd opendaw
   ```
2. Generate the HTTPS development certificates (first time only):
   ```bash
   npm run cert
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the workspace:
   ```bash
   npm run build
   ```
5. Start the studio interface:
   ```bash
   npm run dev:studio
   ```
   Then navigate to https://localhost:8080.
6. Alternatively, start the headless runtime:
   ```bash
   npm run dev:headless
   ```

## Troubleshooting

- **Node version errors** – ensure `node --version` reports **>= 23**.
- **Certificate not trusted** – run `npm run cert` again and verify `mkcert` is installed.
- **Port 8080 already in use** – stop the process occupying the port or change the port in the dev command.
- **Missing dependencies** – run `npm install` after cleaning with `npm run clean`.
