#!/bin/bash

# @packageDocumentation
# Remove build artifacts and dependencies across the monorepo.
#
# Usage:
#   npm run clean
#
# This command is destructive; it deletes node_modules and other generated
# directories to reset the workspace.

set -e  # Exit on any error

echo "📦 Removing all node_modules folders..."
# Remove every node_modules directory in the repository.
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

echo "🗂️  Removing all dist folders..."
# Delete compiled output directories.
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

echo "🔒 Removing all package-lock.json files..."
# Remove lock files to force a fresh npm install.
find . -name "package-lock.json" -type f -delete 2>/dev/null || true

echo "🔒 Removing all .turbo files..."
# Clear Turbo cache directories.
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove generated box sources for the studio package.
rm -rf packages/studio/boxes/src/* 2>/dev/null || true

