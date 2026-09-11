import { Context, InlineKeyboard } from 'grammy';
import { getSafeNow } from '../calendar/lunar.js';
import { checkHolyDay, getUpcomingHolyDays } from '../calendar/holyDays.js';
import { formatUpcomingHolyDays } from '../calendar/formatter.js';

export async function handleSilCommand(ctx: Context, timezone = 'Asia/Phnom_Penh'): Promise<void> {
  const now = getSafeNow(timezone);
  const todayCheck = checkHolyDay(now.year, now.month, now.day);
  const upcoming = getUpcomingHolyDays(now, 4, true);

  const message = formatUpcomingHolyDays(todayCheck, upcoming);

  const keyboard = new InlineKeyboard()
    .text('📅 ប្រតិទិនថ្ងៃនេះ', 'btn_today')
    .text('🎉 បុណ្យជាតិ', 'btn_holiday');

  await ctx.reply(message, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}
