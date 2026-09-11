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

/**
 * Vercel Serverless Function entry point for Telegram Webhook
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const webhookHandler = getWebhookHandler();
    return await webhookHandler(req, res);
  } catch (err: any) {
    console.error('[Vercel Webhook Error]:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: false,
        error: err?.message || 'Internal server error in bot webhook'
      })
    );
  }
}
