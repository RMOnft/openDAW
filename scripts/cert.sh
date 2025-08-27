#!/usr/bin/env bash

# Generate a local HTTPS certificate for development using mkcert.
#
# Usage:
#   npm run cert
#
# Requires mkcert to be installed and trusted on the machine.

set -euo pipefail

echo "Creating localhost certificate with mkcert"
# Switch to the web app directory and generate a certificate for localhost.
cd packages/app && mkcert localhost || {
  echo "mkcert failed. Is mkcert installed and initialized?" >&2
  exit 1
}
