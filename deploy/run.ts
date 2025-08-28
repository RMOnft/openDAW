/**
 * Deployment utility for uploading the built Studio application to the
 * production SFTP server. The script performs a destructive upload of the
 * `packages/app/studio/dist` directory and optionally notifies a Discord
 * channel via webhook when complete. The script is currently disabled and is
 * intended to be run manually by maintainers.
 *
 * @packageDocumentation
 */
// NOTE: Deployment script disabled
import SftpClient from "ssh2-sftp-client";
import * as fs from "fs";
import * as path from "path";

/** Connection credentials for the target SFTP server. */
const config = {
  host: process.env.SFTP_HOST,
  port: Number(process.env.SFTP_PORT),
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
} as const;

/**
 * Flag used for local testing. When set via the `DRY_RUN` environment variable
 * or the `--dry` CLI option the script validates configuration without
 * performing any network calls.
 */
const DRY_RUN = process.env.DRY_RUN === "1" || process.argv.includes("--dry");
console.info(`DRY_RUN: ${DRY_RUN}`);

// Verify that all required environment variables are present before doing any
// work. This avoids partial uploads due to misconfiguration.
const env = Object.entries({
  SFTP_HOST: process.env.SFTP_HOST,
  SFTP_PORT: process.env.SFTP_PORT,
  SFTP_USERNAME: process.env.SFTP_USERNAME,
  SFTP_PASSWORD: process.env.SFTP_PASSWORD,
  DISCORD_WEBHOOK: process.env.DISCORD_WEBHOOK,
});
const missing = env.filter(([, v]) => !v).map(([k]) => k);
if (missing.length > 0) {
  throw new Error(`Missing secrets/vars: ${missing.join(", ")}`);
}
if (DRY_RUN) {
  console.log(
    "✅ All secrets & variables are set. Nothing was uploaded (dry-run).",
  );
  process.exit(0);
}

const sftp = new SftpClient();

// Remote directories that must never be removed during deployment. Any file
// or directory listed here will be skipped by the upload step.
const staticFolders = ["/viscious-speed"];

/**
 * Recursively removes files and folders from the remote host.
 *
 * @param remoteDir - The absolute path on the SFTP server to purge.
 */
async function deleteDirectory(remoteDir: string) {
  const items = await sftp.list(remoteDir);
  for (const item of items) {
    const remotePath = path.posix.join(remoteDir, item.name);
    if (staticFolders.includes(remotePath)) continue; // keep static assets
    if (item.type === "d") {
      await deleteDirectory(remotePath);
      await sftp.rmdir(remotePath, true);
    } else {
      await sftp.delete(remotePath);
    }
  }
}

/**
 * Uploads a local directory to the remote host, mirroring the directory
 * structure. Existing files are replaced.
 *
 * @param localDir - Path to the local source directory.
 * @param remoteDir - Destination path on the SFTP server.
 */
async function uploadDirectory(localDir: string, remoteDir: string) {
  for (const file of fs.readdirSync(localDir)) {
    const localPath = path.join(localDir, file);
    const remotePath = path.posix.join(remoteDir, file);
    if (fs.lstatSync(localPath).isDirectory()) {
      await sftp.mkdir(remotePath, true).catch(() => {
        /* exists */
      });
      if (staticFolders.includes(remotePath)) continue;
      await uploadDirectory(localPath, remotePath);
    } else {
      console.log(`upload ${remotePath}`);
      await sftp.put(localPath, remotePath);
    }
  }
}

// --------------------- main -------------------------------------------------
(async () => {
  console.log(`⏩ upload…`);
  await sftp.connect(config);
  await deleteDirectory("/");
  await uploadDirectory("./packages/app/studio/dist", "/");
  await sftp.end();

  const webhookUrl = process.env.DISCORD_WEBHOOK;
  if (webhookUrl) {
    console.log("posting to discord...");
    const now = Math.floor(Date.now() / 1000); // in seconds
    const content = `🚀 **openDAW** has been deployed to <https://opendaw.studio> <t:${now}:R>.`;
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      console.log(response);
    } catch (error) {
      console.warn(error);
    }
  }
  console.log("deploy complete");
})();
