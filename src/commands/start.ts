import { Context, InlineKeyboard } from 'grammy';

export function getMainMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📅 ថ្ងៃនេះ (Today)', 'btn_today')
    .text('🪷 ថ្ងៃសីល (Holy Days)', 'btn_sil')
    .row()
    .text('🎉 បុណ្យជាតិ (Holidays)', 'btn_holiday')
    .text('🔄 បម្លែង (Convert)', 'btn_convert');
}

export async function handleStartCommand(ctx: Context): Promise<void> {
  const welcomeMessage = [
    '🇰🇭 <b>ប្រតិទិនចន្ទគតិខ្មែរ • KHMER CALENDAR BOT</b>',
    '<i>ប្រព័ន្ធគណនាប្រតិទិនចន្ទគតិខ្មែរ និងបុណ្យជាតិ ត្រឹមត្រូវ និងទាន់សម័យ</i>',
    '──────────────────────────',
    '',
    '<blockquote>✨ <b>មុខងារសំខាន់ៗ (Features):</b>',
    '• គណនាកាលបរិច្ឆេទចន្ទគតិខ្មែរ (Solar & Lunar conversion)',
    '• ដំណាក់កាលព្រះចន្ទ (Waxing / Waning moon phases)',
    '• ពិនិត្យថ្ងៃសីល ៨កើត ១៥កើត ៨រោច និងដាច់ខែ (Holy Days)',
    '• ពិធីបុណ្យជាតិ និងប្រពៃណីខ្មែរ (Cambodian Holidays)</blockquote>',
    '',
    '📌 <b>ចុចលើពាក្យបញ្ជាខាងក្រោមដើម្បីចម្លង (Tap to copy):</b>',
    '<code>/convert 2026-09-05</code>',
    '<code>/convert 2026-04-14</code>',
    '<code>/convert 2026-10-11</code>',
    '──────────────────────────',
    '👇 <i>ឬចុចប៊ូតុងមុខងាររហ័សខាងក្រោម៖</i>'
  ].join('\n');

  await ctx.reply(welcomeMessage, {
    parse_mode: 'HTML',
    reply_markup: getMainMenuKeyboard()
  });
}
