# Deployment Scripts

The files in this directory assist with deploying the built Studio
application to the production server. The scripts are **disabled** by default
and must be run manually.

## `run.ts`

Uploads `packages/app/studio/dist` to the configured SFTP host.

1. Install dependencies: `npm install` (once).
2. Build the Studio app: `npm run build`.
3. Export required environment variables:
   - `SFTP_HOST`
   - `SFTP_PORT`
   - `SFTP_USERNAME`
   - `SFTP_PASSWORD`
   - (optional) `DISCORD_WEBHOOK` for deployment notifications.
4. Run the script with `ts-node deploy/run.ts`.
   - Add `--dry` to perform a dry run that only validates configuration.

## `discord.ts`

Sends a test message to the `DISCORD_WEBHOOK` environment variable. Useful for
verifying that the webhook URL is valid before performing a deployment.

Run with: `ts-node deploy/discord.ts`.
