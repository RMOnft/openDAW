/**
 * Small helper script that posts a test message to the configured Discord
 * webhook. Used by CI to verify that the webhook secret is valid. The script is
 * disabled by default and should only be invoked manually.
 */
(async () => {
  // NOTE: Deployment script disabled

  // Fetch the webhook URL from the environment; bail out if it is missing so
  // the CI job fails fast with a clear error.
  const webhookUrl = process.env.DISCORD_WEBHOOK;
  if (!webhookUrl) {
    console.error("Missing DISCORD_WEBHOOK");
    process.exit(1);
  }

  // Construct and send the message to Discord.
  const content = "🧪 Discord test from GitHub Actions";
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  // Fail the script if Discord returns a non-success status code.
  if (!res.ok) {
    console.error(`Failed to post: ${res.status}`, await res.text());
    process.exit(1);
  }

  console.log("✅ Discord message sent");
})();
