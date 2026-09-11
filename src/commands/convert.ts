import { Context, InlineKeyboard } from 'grammy';
import { DateTime } from 'luxon';
import { getCalendarDayReport, formatConvertResult, escapeHtml } from '../calendar/formatter.js';

export async function handleConvertCommand(ctx: Context, customInput?: string): Promise<void> {
  const text = customInput || ctx.message?.text || '';

  // Extract year, month, day flexibly from message
  const dateMatch = text.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);

  if (!dateMatch) {
    const helpMessage = [
      '🔄 <b>បម្លែងកាលបរិច្ឆេទសកលទៅជាចន្ទគតិ</b>',
      '<i>Convert Gregorian to Khmer Lunisolar Date</i>',
      '──────────────────────────',
      '📌 <b>ទម្រង់ត្រឹមត្រូវ (Format):</b> <code>/convert YYYY-MM-DD</code>',
      '',
      '<blockquote>💡 <b>ចុចលើពាក្យបញ្ជាខាងក្រោមដើម្បីចម្លង (Tap to copy):</b>',
      '• <code>/convert 2026-09-05</code>',
      '• <code>/convert 2026-04-14</code>',
      '• <code>/convert 2026-10-11</code>',
      '• <code>/convert 1993-09-24</code></blockquote>'
    ].join('\n');

    const keyboard = new InlineKeyboard()
      .text('📅 ថ្ងៃនេះ', 'btn_today')
      .text('🪷 ថ្ងៃសីល', 'btn_sil');

    await ctx.reply(helpMessage, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
    return;
  }

  const year = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const day = parseInt(dateMatch[3], 10);

  // Validate range with luxon
  const dt = DateTime.fromObject({ year, month, day });
  if (!dt.isValid) {
    await ctx.reply(
      `❌ <b>កាលបរិច្ឆេទមិនត្រឹមត្រូវ:</b> ${escapeHtml(dt.invalidExplanation || 'កាលបរិច្ឆេទនេះមិនមានក្នុងប្រតិទិនឡើយ')}`,
      { parse_mode: 'HTML' }
    );
    return;
  }

  if (year < 1900 || year > 2100) {
    await ctx.reply(
      '⚠️ <b>ឆ្នាំមិនត្រឹមត្រូវ:</b> សូមបញ្ចូលឆ្នាំចន្លោះពី 1900 ដល់ 2100។',
      { parse_mode: 'HTML' }
    );
    return;
  }

  try {
    const report = getCalendarDayReport(year, month, day);
    const message = formatConvertResult(report);

    const keyboard = new InlineKeyboard()
      .text('📅 ថ្ងៃនេះ', 'btn_today')
      .text('🪷 ថ្ងៃសីល', 'btn_sil');

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  } catch (error: any) {
    await ctx.reply(
      `❌ <b>មានបញ្ហាក្នុងការបម្លែង:</b> ${escapeHtml(error.message || 'សូមពិនិត្យកាលបរិច្ឆេទឡើងវិញ')}`,
      { parse_mode: 'HTML' }
    );
  }
}
