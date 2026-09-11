import { Context, InlineKeyboard } from 'grammy';
import { getSafeNow } from '../calendar/lunar.js';
import { getUpcomingHolidays } from '../calendar/holidays.js';
import { formatUpcomingHolidays } from '../calendar/formatter.js';

export async function handleHolidayCommand(ctx: Context, timezone = 'Asia/Phnom_Penh'): Promise<void> {
  const now = getSafeNow(timezone);
  const upcoming = getUpcomingHolidays(now, 4, true);

  const message = formatUpcomingHolidays(upcoming);

  const keyboard = new InlineKeyboard()
    .text('📅 ប្រតិទិនថ្ងៃនេះ', 'btn_today')
    .text('🪷 ថ្ងៃសីល', 'btn_sil');

  await ctx.reply(message, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}
