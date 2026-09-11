import { Context, InlineKeyboard } from 'grammy';
import { getSafeNow } from '../calendar/lunar.js';
import { getCalendarDayReport, formatDailyBroadcast } from '../calendar/formatter.js';

export async function handleTodayCommand(ctx: Context, timezone = 'Asia/Phnom_Penh'): Promise<void> {
  const now = getSafeNow(timezone);
  const report = getCalendarDayReport(now.year, now.month, now.day);
  const message = formatDailyBroadcast(report);

  const keyboard = new InlineKeyboard()
    .text('🪷 ពិនិត្យថ្ងៃសីល', 'btn_sil')
    .text('🎉 បុណ្យជាតិខាងមុខ', 'btn_holiday')
    .row()
    .text('🔄 បម្លែងកាលបរិច្ឆេទ', 'btn_convert');

  await ctx.reply(message, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}
