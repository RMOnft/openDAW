# Discord Notifications

Deployments can optionally notify a Discord channel via webhook.

1. Create a webhook in the desired Discord channel.
2. Set the `DISCORD_WEBHOOK` environment variable to the webhook URL.
3. Run `ts-node deploy/discord.ts` to send a test message.
4. When running the main deployment script, a message is posted after a
   successful upload.
