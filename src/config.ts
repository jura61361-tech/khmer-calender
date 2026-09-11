import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

export interface BotConfig {
  botToken: string;
  channelId?: string;
  cronSchedule: string;
  timezone: string;
}

export function loadConfig(): BotConfig {
  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    throw new Error('Missing required environment variable: BOT_TOKEN. Please set it in your .env file.');
  }

  let tz = (process.env.TIMEZONE || 'Asia/Phnom_Penh').trim().replace(/['"]/g, '');
  if (!tz) tz = 'Asia/Phnom_Penh';

  return {
    botToken: botToken.trim(),
    channelId: process.env.CHANNEL_ID && process.env.CHANNEL_ID.trim() !== '@YourChannelUsernameOrId' && process.env.CHANNEL_ID.trim() !== ''
      ? process.env.CHANNEL_ID.trim()
      : undefined,
    cronSchedule: (process.env.CRON_SCHEDULE || '0 6 * * *').trim(),
    timezone: tz
  };
}
