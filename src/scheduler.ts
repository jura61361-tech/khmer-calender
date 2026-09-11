import cron, { ScheduledTask } from 'node-cron';
import { Bot } from 'grammy';
import { DateTime } from 'luxon';
import { BotConfig } from './config.js';
import { getCalendarDayReport, formatDailyBroadcast } from './calendar/formatter.js';

/**
 * Manually trigger daily calendar broadcast to a given channel
 */
export async function broadcastDailyCalendar(
  bot: Bot,
  channelId: string,
  timezone = 'Asia/Phnom_Penh'
): Promise<boolean> {
  try {
    const now = DateTime.now().setZone(timezone);
    const report = getCalendarDayReport(now.year, now.month, now.day);
    const message = formatDailyBroadcast(report);

    console.log(`[Scheduler] Broadcasting daily calendar to channel: ${channelId}...`);
    await bot.api.sendMessage(channelId, message, { parse_mode: 'HTML' });
    console.log(`[Scheduler] Successfully broadcasted daily calendar to channel: ${channelId}`);
    return true;
  } catch (error: any) {
    console.error(`[Scheduler] Failed to broadcast daily calendar to channel ${channelId}:`, error?.message || error);
    return false;
  }
}

/**
 * Initialize and start the daily automated broadcast scheduler
 */
export function initScheduler(bot: Bot, config: BotConfig): ScheduledTask {
  const { channelId, cronSchedule, timezone } = config;

  console.log(`[Scheduler] Initializing cron job: "${cronSchedule}" in timezone: "${timezone}"`);

  if (!channelId) {
    console.warn(
      '[Scheduler] ⚠️ WARNING: CHANNEL_ID is not configured in .env. Daily broadcasts will be skipped until CHANNEL_ID is set.'
    );
  } else {
    console.log(`[Scheduler] Target broadcast channel: ${channelId}`);
  }

  const task = cron.schedule(
    cronSchedule,
    async () => {
      console.log(`[Scheduler] Cron trigger activated at ${DateTime.now().setZone(timezone).toISO()}`);
      if (!channelId) {
        console.warn('[Scheduler] CHANNEL_ID not set. Skipping channel broadcast.');
        return;
      }

      await broadcastDailyCalendar(bot, channelId, timezone);
    },
    {
      timezone: timezone
    }
  );

  return task;
}
