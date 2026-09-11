import type { IncomingMessage, ServerResponse } from 'node:http';
import { createBot } from '../src/bot.js';
import { loadConfig } from '../src/config.js';
import { broadcastDailyCalendar } from '../src/scheduler.js';

/**
 * Vercel Serverless Function entry point for daily broadcast cron job
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Verify authorization if CRON_SECRET is set
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Unauthorized: invalid CRON_SECRET' }));
    return;
  }

  try {
    const config = loadConfig();

    if (!config.channelId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: false,
          error: 'CHANNEL_ID is not set in Vercel environment variables'
        })
      );
      return;
    }

    const bot = createBot(config);
    const success = await broadcastDailyCalendar(bot, config.channelId, config.timezone);

    res.statusCode = success ? 200 : 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: success,
        channel: config.channelId,
        timezone: config.timezone,
        timestamp: new Date().toISOString(),
        message: success ? 'Daily Khmer Calendar broadcast sent' : 'Failed to send broadcast'
      })
    );
  } catch (err: any) {
    console.error('[Vercel Cron Error]:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: false,
        error: err?.message || 'Internal error executing broadcast cron'
      })
    );
  }
}
