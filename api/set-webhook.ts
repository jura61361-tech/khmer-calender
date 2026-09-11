import type { IncomingMessage, ServerResponse } from 'node:http';
import { createBot, registerBotCommands } from '../src/bot.js';
import { loadConfig } from '../src/config.js';

/**
 * Vercel Serverless Function to register Telegram Webhook and command menu
 * Visit: https://<your-project>.vercel.app/api/set-webhook
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const config = loadConfig();
    const bot = createBot(config);

    const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string);
    const webhookUrl = `${protocol}://${host}/api/bot`;

    console.log(`[Vercel] Setting webhook to: ${webhookUrl}`);
    const webhookResult = await bot.api.setWebhook(webhookUrl, {
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: false
    });

    // Register Telegram slash command menu
    await registerBotCommands(bot);

    // Fetch bot profile information
    const me = await bot.api.getMe();
    const webhookInfo = await bot.api.getWebhookInfo();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        {
          ok: true,
          message: 'Telegram Webhook and Commands configured successfully!',
          bot: {
            id: me.id,
            username: `@${me.username}`,
            first_name: me.first_name
          },
          webhook: {
            success: webhookResult,
            url: webhookInfo.url,
            has_custom_certificate: webhookInfo.has_custom_certificate,
            pending_update_count: webhookInfo.pending_update_count
          },
          endpoints: {
            webhook: webhookUrl,
            cron: `${protocol}://${host}/api/cron`
          }
        },
        null,
        2
      )
    );
  } catch (err: any) {
    console.error('[Set-Webhook Error]:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        {
          ok: false,
          error: err?.message || 'Failed to configure webhook. Check BOT_TOKEN.'
        },
        null,
        2
      )
    );
  }
}
