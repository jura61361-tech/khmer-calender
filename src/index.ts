import { run } from '@grammyjs/runner';
import { loadConfig } from './config.js';
import { createBot, registerBotCommands } from './bot.js';
import { initScheduler } from './scheduler.js';

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🇰🇭 Khmer Calendar Telegram Bot (Chhankitek)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Load and validate config
  const config = loadConfig();

  // Create bot instance
  const bot = createBot(config);

  // Initialize daily broadcast scheduler
  const schedulerTask = initScheduler(bot, config);

  // Verify connection by getting bot profile & warming up TCP connection
  try {
    const me = await bot.api.getMe();
    console.log(`✅ Telegram Bot verified: @${me.username} (ID: ${me.id}, Name: ${me.first_name})`);
  } catch (err: any) {
    console.error('❌ Failed to connect to Telegram API with BOT_TOKEN:', err?.message || err);
    console.error('Please verify your BOT_TOKEN in .env and make sure you have internet access.');
    process.exit(1);
  }

  // Register command menu asynchronously without blocking polling start
  registerBotCommands(bot).catch(() => {});

  // Start high-performance concurrent runner
  console.log('🚀 Starting high-speed bot runner with continuous streaming...');
  const runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: ['message', 'callback_query'],
        timeout: 20
      }
    }
  });

  console.log('⚡ Khmer Calendar Bot is now running with instant concurrent processing!');

  // Graceful shutdown
  const handleShutdown = async (signal: string) => {
    console.log(`\n[Bot] Received ${signal}. Stopping bot runner and scheduler gracefully...`);
    schedulerTask.stop();
    if (runner.isRunning()) {
      await runner.stop();
    }
    console.log('[Bot] Bot stopped cleanly. Exiting process.');
    process.exit(0);
  };

  process.once('SIGINT', () => handleShutdown('SIGINT'));
  process.once('SIGTERM', () => handleShutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
