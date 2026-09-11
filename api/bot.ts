import type { IncomingMessage, ServerResponse } from 'node:http';
import { webhookCallback } from 'grammy';
import { createBot } from '../src/bot.js';
import { loadConfig } from '../src/config.js';

let cachedHandler: ((req: IncomingMessage, res: ServerResponse) => Promise<void>) | null = null;

function getWebhookHandler() {
  if (!cachedHandler) {
    const config = loadConfig();
    const bot = createBot(config);
    cachedHandler = webhookCallback(bot, 'http');
  }
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const webhookHandler = getWebhookHandler();
    return await webhookHandler(req, res);
  } catch (err: any) {
    console.error('[Vercel Webhook Error]:', err?.message || err);
    if (!res.writableEnded) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: false,
          error: err?.message || 'Error handling update'
        })
      );
    }
  }
}
