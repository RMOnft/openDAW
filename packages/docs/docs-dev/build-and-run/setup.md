# Setup

These steps build the packages
[`@opendaw/app-studio`](../package-inventory.md#app) and
[`@opendaw/app-headless`](../package-inventory.md#app). Follow them after
confirming [browser support](../browser-support.md).

## Prerequisites

Before starting, install the following tools for your platform.

### Windows

- [Git](https://git-scm.com/) – install [Git for Windows](https://gitforwindows.org/) or use WSL.
- [mkcert](https://github.com/FiloSottile/mkcert#installation) – in PowerShell run `choco install mkcert` and then `mkcert -install`.
- [Node.js](https://nodejs.org/) **>= 23** – download from the Node.js site or install with `choco install nodejs`.
- [Sass](https://sass-lang.com/) – `npm install -g sass`.
- [TypeScript](https://www.typescriptlang.org/) – `npm install -g typescript`.
- [OpenSSL](https://openssl-library.org/) – bundled with Git for Windows or install with `choco install openssl`.

### macOS

- [Git](https://git-scm.com/) – install via Xcode command line tools: `xcode-select --install`.
- [mkcert](https://github.com/FiloSottile/mkcert#installation) – `brew install mkcert` (add `nss` for Firefox) and then `mkcert -install`.
- [Node.js](https://nodejs.org/) **>= 23** – install with Homebrew (`brew install node`) or `nvm install 23`.
- [Sass](https://sass-lang.com/) – `npm install -g sass`.
- [TypeScript](https://www.typescriptlang.org/) – `npm install -g typescript`.
- [OpenSSL](https://openssl-library.org/) – preinstalled or `brew install openssl` if needed.

### Linux

- [Git](https://git-scm.com/) – use your distribution's package manager, e.g. `sudo apt install git`.
- [mkcert](https://github.com/FiloSottile/mkcert#installation) – install with `sudo apt install mkcert libnss3-tools` and run `mkcert -install`.
- [Node.js](https://nodejs.org/) **>= 23** – install using `nvm install 23` or a distribution package.
- [Sass](https://sass-lang.com/) – `npm install -g sass`.
- [TypeScript](https://www.typescriptlang.org/) – `npm install -g typescript`.
- [OpenSSL](https://openssl-library.org/) – usually preinstalled; otherwise `sudo apt install openssl`.

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

Proceed to [running tests](./tests.md) or learn about
[profiling](./profiling.md).

## Troubleshooting

- **Node version errors** – ensure `node --version` reports **>= 23**.
- **Certificate not trusted** – run `npm run cert` again and verify `mkcert` is installed.
- **Port 8080 already in use** – stop the process occupying the port or change the port in the dev command.
- **Missing dependencies** – run `npm install` after cleaning with `npm run clean`.
