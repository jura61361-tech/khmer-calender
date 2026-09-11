import { Bot } from 'grammy';
import { sequentialize } from '@grammyjs/runner';
import { BotConfig } from './config.js';
import { handleStartCommand } from './commands/start.js';
import { handleTodayCommand } from './commands/today.js';
import { handleSilCommand } from './commands/sil.js';
import { handleHolidayCommand } from './commands/holiday.js';
import { handleConvertCommand } from './commands/convert.js';

export function createBot(config: BotConfig): Bot {
  const bot = new Bot(config.botToken);

  // Sequentialize requests per chat to process different chats concurrently without race conditions
  bot.use(sequentialize((ctx) => ctx.chat?.id.toString()));

  // Send instant typing indicator for commands so user immediately sees response feedback
  bot.use(async (ctx, next) => {
    if (ctx.chat && ctx.message?.text) {
      const trimmed = ctx.message.text.trim();
      if (trimmed.startsWith('/') || trimmed.startsWith('•')) {
        ctx.replyWithChatAction('typing').catch(() => {});
      }
    }
    await next();
  });

  // Standard commands
  bot.command(['start', 'help'], (ctx) => handleStartCommand(ctx));
  bot.command('today', (ctx) => handleTodayCommand(ctx, config.timezone));
  bot.command('sil', (ctx) => handleSilCommand(ctx, config.timezone));
  bot.command('holiday', (ctx) => handleHolidayCommand(ctx, config.timezone));
  bot.command('convert', (ctx) => handleConvertCommand(ctx));

  // Bullet-tolerant listeners (handles when users copy "• /command" directly from message text)
  bot.hears(/^[•\-\*\s]*\/start/i, (ctx) => handleStartCommand(ctx));
  bot.hears(/^[•\-\*\s]*\/help/i, (ctx) => handleStartCommand(ctx));
  bot.hears(/^[•\-\*\s]*\/today/i, (ctx) => handleTodayCommand(ctx, config.timezone));
  bot.hears(/^[•\-\*\s]*\/sil/i, (ctx) => handleSilCommand(ctx, config.timezone));
  bot.hears(/^[•\-\*\s]*\/holiday/i, (ctx) => handleHolidayCommand(ctx, config.timezone));
  bot.hears(/^[•\-\*\s]*\/convert(.*)/i, (ctx) => handleConvertCommand(ctx));

  // Interactive inline button callbacks
  bot.callbackQuery('btn_today', async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    await handleTodayCommand(ctx, config.timezone);
  });

  bot.callbackQuery('btn_sil', async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    await handleSilCommand(ctx, config.timezone);
  });

  bot.callbackQuery('btn_holiday', async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    await handleHolidayCommand(ctx, config.timezone);
  });

  bot.callbackQuery('btn_convert', async (ctx) => {
    await ctx.answerCallbackQuery().catch(() => {});
    await handleConvertCommand(ctx);
  });

  // Global error handler
  bot.catch(async (err) => {
    const ctx = err.ctx;
    console.error(`[Bot] Error while handling update ${ctx.update.update_id}:`, err.error);
    try {
      if (ctx.chat) {
        await ctx.reply('⚠️ សូមអភ័យទោស ប្រព័ន្ធមានបញ្ហាបន្តិចបន្តួច។ សូមព្យាយាមម្ដងទៀត។');
      }
    } catch {}
  });

  return bot;
}

export async function registerBotCommands(bot: Bot): Promise<void> {
  try {
    await bot.api.setMyCommands([
      { command: 'today', description: '📅 មើលប្រតិទិនចន្ទគតិថ្ងៃនេះ (Today’s Khmer calendar)' },
      { command: 'sil', description: '🪷 ពិនិត្យថ្ងៃសីល និងកាលវិភាគថ្ងៃសីល (Buddhist Holy Days)' },
      { command: 'holiday', description: '🎉 ពិនិត្យថ្ងៃឈប់សម្រាកបុណ្យជាតិ (Cambodian Holidays)' },
      { command: 'convert', description: '🔄 បម្លែងកាលបរិច្ឆេទសកល (Convert Gregorian to Khmer date)' },
      { command: 'help', description: 'ℹ️ បង្ហាញជំនួយ និងពាក្យបញ្ជា (Help & guide)' },
      { command: 'start', description: '🚀 ចាប់ផ្ដើមប្រើប្រាស់ Bot (Start the bot)' }
    ]);
  } catch (err: any) {
    console.warn('[Bot] Note: Could not set commands menu:', err?.message);
  }
}
