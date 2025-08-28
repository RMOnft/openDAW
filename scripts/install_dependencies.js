#!/usr/bin/env node

/**
 * Install required system dependencies for developing openDAW.
 *
 * @packageDocumentation
 *
 * Usage:
 *   npm run install:deps
 *
 * The script checks for common tools (Git, Node.js, mkcert, Sass,
 * TypeScript, OpenSSL) and installs any missing ones using the
 * platform's package manager. It finishes by running `npm install`
 * to fetch JavaScript dependencies for the repository.
 */

const { execSync } = require('child_process');
const os = require('os');

// Determine the current operating system to select install commands.
const platform = os.platform();

// Helper to run shell commands and forward their output.
function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

// List of external dependencies to verify and potentially install.
const deps = [
  {
    name: 'git',
    check: 'git --version',
    install: {
      linux: 'sudo apt-get update && sudo apt-get install -y git',
      darwin: 'brew install git',
      win32: 'choco install git'
    }
  },
  {
    name: 'node (>=23)',
    check: 'node --version',
    verify: v => parseInt(v.replace(/^v/, '').split('.')[0], 10) >= 23,
    install: {
      linux: 'curl -fsSL https://deb.nodesource.com/setup_23.x | sudo -E bash - && sudo apt-get install -y nodejs',
      darwin: 'brew install node@23',
      win32: 'choco install nodejs-lts'
    }
  },
  {
    name: 'mkcert',
    check: 'mkcert -V',
    install: {
      linux: 'sudo apt-get install -y libnss3-tools && curl -L https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-$(uname -s)-$(uname -m) >/tmp/mkcert && chmod +x /tmp/mkcert && sudo mv /tmp/mkcert /usr/local/bin/mkcert && mkcert -install',
      darwin: 'brew install mkcert && mkcert -install',
      win32: 'choco install mkcert'
    }
  },
  {
    name: 'sass',
    check: 'sass --version',
    install: {
      linux: 'npm install -g sass',
      darwin: 'npm install -g sass',
      win32: 'npm install -g sass'
    }
  },
  {
    name: 'typescript',
    check: 'tsc -v',
    install: {
      linux: 'npm install -g typescript',
      darwin: 'npm install -g typescript',
      win32: 'npm install -g typescript'
    }
  },
  {
    name: 'openssl',
    check: 'openssl version',
    install: {
      linux: 'sudo apt-get install -y openssl',
      darwin: 'brew install openssl',
      win32: 'choco install openssl'
    }
  }
];

for (const dep of deps) {
  let installed = false;
  try {
    // Run the dependency's check command to see if it is installed.
    const output = execSync(dep.check, { stdio: 'pipe' }).toString().trim();
    if (dep.verify) {
      // Some dependencies require version validation (e.g., Node.js >= 23).
      installed = dep.verify(output);
    } else {
      installed = true;
    }
  } catch (e) {
    installed = false;
  }

  if (installed) {
    console.log(`${dep.name} already installed`);
    continue;
  }

  // Select the installation command for the current platform.
  const installCmd = dep.install[platform];
  if (!installCmd) {
    console.log(`No install command for ${dep.name} on ${platform}. Please install manually.`);
    continue;
  }

  try {
    console.log(`Installing ${dep.name}...`);
    run(installCmd);
  } catch (err) {
    console.error(`Failed to install ${dep.name}:`, err.message);
  }
}

// Finally install Node.js packages for the repository itself.
try {
  console.log('Installing npm packages...');
  run('npm install');
} catch (err) {
  console.error('Failed to install npm packages:', err.message);
}
