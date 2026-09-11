import { DateTime } from 'luxon';
import { KhmerLunarDetails, toKhmerDigits } from './lunar.js';
import { checkHolyDay, HolyDayCheckResult, UpcomingHolyDay } from './holyDays.js';
import { getHolidaysForDate, Holiday, UpcomingHolidayItem } from './holidays.js';

export interface CalendarDayReport {
  details: KhmerLunarDetails;
  holyDay: HolyDayCheckResult;
  holidays: Holiday[];
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Gather full calendar report for a given date
 */
export function getCalendarDayReport(year: number, month: number, day: number): CalendarDayReport {
  const holyDay = checkHolyDay(year, month, day);
  const details = holyDay.details!;
  const holidays = getHolidaysForDate(year, month, day);

  return { details, holyDay, holidays };
}

/**
 * Format the standard daily calendar card with premium clean aesthetics
 */
export function formatDailyBroadcast(report: CalendarDayReport): string {
  const { details, holyDay, holidays } = report;

  // Holy day representation
  let silText = '⚪ ទេ (ធម្មតា)';
  if (holyDay.isHolyDay) {
    silText = `🟢 <b>${escapeHtml(holyDay.phaseLabelKhmer || '')}</b> (ថ្ងៃនេះជាថ្ងៃសីល 🪷)`;
  }

  // Holiday representation
  let holidayText = '<i>គ្មាន</i>';
  if (holidays.length > 0) {
    holidayText = holidays
      .map(h => `🎊 <b>${escapeHtml(h.nameKhmer)}</b>\n   <i>${escapeHtml(h.nameEnglish)}</i>`)
      .join('\n');
  }

  // Dynamic tags
  const tags = ['#KhmerCalendar', '#ប្រតិទិនខ្មែរ'];
  if (holyDay.isHolyDay) {
    tags.push('#ថ្ងៃសីល');
  }
  if (holidays.length > 0) {
    tags.push('#បុណ្យជាតិ');
  }

  const tagsHtml = tags.map(t => `<code>${t}</code>`).join(' ');

  return [
    '🇰🇭 <b>ប្រតិទិនចន្ទគតិខ្មែរ • DAILY KHMER CALENDAR</b>',
    '──────────────────────────',
    `📅 <b>${escapeHtml(details.formattedSolarKhmer)}</b>`,
    `🗓️ <i>${escapeHtml(details.formattedSolarEnglish)}</i>`,
    '',
    `<blockquote>🌙 <b>${escapeHtml(details.formattedLunarKhmer)}</b>`,
    `Phase: ${escapeHtml(details.formattedPhaseEnglish)}`,
    `Year: ${details.animalYearEmoji} ឆ្នាំ${escapeHtml(details.animalYearNameKhmer)} (${escapeHtml(details.animalYearNameEnglish)})</blockquote>`,
    '',
    `🪷 <b>ថ្ងៃសីល (Holy Day):</b> ${silText}`,
    `🎉 <b>បុណ្យជាតិ (Holiday):</b> ${holidayText}`,
    '──────────────────────────',
    tagsHtml
  ].join('\n');
}

/**
 * Format the response for /sil command with clean card blocks
 */
export function formatUpcomingHolyDays(
  todayCheck: HolyDayCheckResult,
  upcoming: UpcomingHolyDay[]
): string {
  const lines: string[] = [
    '🪷 <b>កាលវិភាគថ្ងៃសីល • BUDDHIST HOLY DAYS</b>',
    '──────────────────────────'
  ];

  if (todayCheck.isHolyDay) {
    lines.push(
      '<blockquote>✨ <b>ថ្ងៃនេះជាថ្ងៃសីល! (Today is a Buddhist Holy Day)</b>',
      `🪷 ដំណាក់កាល: <b>${escapeHtml(todayCheck.phaseLabelKhmer || '')}</b>`,
      `🌙 ${escapeHtml(todayCheck.details?.formattedLunarKhmer || '')}</blockquote>`,
      '',
      '📅 <b>ថ្ងៃសីលបន្ទាប់ (Next Upcoming Holy Days):</b>'
    );
  } else {
    lines.push(
      'ℹ️ <i>ថ្ងៃនេះមិនមែនជាថ្ងៃសីលទេ (Today is not a Buddhist Holy Day)</i>',
      '',
      '📅 <b>ថ្ងៃសីលដែលនឹងមកដល់ (Upcoming Holy Days):</b>'
    );
  }

  const filtered = todayCheck.isHolyDay ? upcoming.filter(u => !u.isToday) : upcoming;

  filtered.slice(0, 4).forEach((item, index) => {
    const daysKh = toKhmerDigits(item.daysRemaining);
    let remainingBadge = '';
    if (item.daysRemaining === 1) {
      remainingBadge = '👉 <b>ថ្ងៃស្អែក (Tomorrow)</b>';
    } else {
      remainingBadge = `⏳ <b>នៅសល់ ${daysKh} ថ្ងៃ</b> <i>(in ${item.daysRemaining} days)</i>`;
    }

    lines.push(
      `<blockquote><b>${toKhmerDigits(index + 1)}. ${escapeHtml(item.phaseLabelKhmer)}</b> • ${remainingBadge}`,
      `📅 ${escapeHtml(item.formattedSolarKhmer)}`,
      `🌙 ${escapeHtml(item.formattedLunarKhmer)}</blockquote>`
    );
  });

  lines.push(
    '──────────────────────────',
    '<code>#KhmerCalendar</code> <code>#ថ្ងៃសីល</code> <code>#ThngaiSil</code>'
  );

  return lines.join('\n');
}

/**
 * Format the response for /holiday command with elegant cards
 */
export function formatUpcomingHolidays(upcoming: UpcomingHolidayItem[]): string {
  const lines: string[] = [
    '🎉 <b>ពិធីបុណ្យជាតិ និងប្រពៃណីខ្មែរ • CAMBODIAN HOLIDAYS</b>',
    '──────────────────────────'
  ];

  if (upcoming.length === 0) {
    lines.push('<i>ពុំមានបុណ្យជាតិនាពេលខាងមុខនេះទេ (No upcoming holidays found)</i>');
  } else {
    lines.push('📅 <b>កម្មវិធីបុណ្យជាតិខាងមុខ (Upcoming Public Holidays):</b>\n');

    upcoming.forEach((h, index) => {
      const daysKh = toKhmerDigits(h.daysRemaining);
      let countdown = '';
      if (h.isToday) {
        countdown = '🌟 <b>ថ្ងៃនេះ (Today!)</b>';
      } else if (h.daysRemaining === 1) {
        countdown = '👉 <b>ថ្ងៃស្អែក (Tomorrow)</b>';
      } else {
        countdown = `⏳ <b>នៅសល់ ${daysKh} ថ្ងៃ</b> <i>(in ${h.daysRemaining} days)</i>`;
      }

      lines.push(
        `<blockquote>🎊 <b>${escapeHtml(h.nameKhmer)}</b>`,
        `<i>${escapeHtml(h.nameEnglish)}</i>`,
        `${countdown}`,
        `🗓️ ${escapeHtml(h.formattedSolarKhmer)}`,
        `🌙 ${escapeHtml(h.formattedLunarKhmer)}</blockquote>`
      );
    });
  }

  lines.push(
    '──────────────────────────',
    '<code>#KhmerCalendar</code> <code>#បុណ្យជាតិ</code> <code>#CambodiaHolidays</code>'
  );

  return lines.join('\n');
}

/**
 * Format date conversion output for /convert command with premium layout
 */
export function formatConvertResult(report: CalendarDayReport): string {
  const { details, holyDay, holidays } = report;

  const silBadge = holyDay.isHolyDay
    ? `🟢 <b>${escapeHtml(holyDay.phaseLabelKhmer || '')}</b> (ថ្ងៃសីល)`
    : '⚪ ទេ (ធម្មតា)';

  let holidayBadge = '<i>គ្មាន</i>';
  if (holidays.length > 0) {
    holidayBadge = holidays.map(h => `🎊 <b>${escapeHtml(h.nameKhmer)}</b> (${escapeHtml(h.nameEnglish)})`).join(', ');
  }

  return [
    '🔄 <b>លទ្ធផលបម្លែងកាលបរិច្ឆេទ • DATE CONVERSION</b>',
    '──────────────────────────',
    '📅 <b>កាលបរិច្ឆេទសកល (Solar Date):</b>',
    `<blockquote><b>${escapeHtml(details.formattedSolarKhmer)}</b>`,
    `<i>${escapeHtml(details.formattedSolarEnglish)}</i></blockquote>`,
    '',
    '🌙 <b>កាលបរិច្ឆេទចន្ទគតិ (Khmer Lunisolar Date):</b>',
    `<blockquote><b>${escapeHtml(details.formattedLunarKhmer)}</b>`,
    `• ដំណាក់កាល: <b>${escapeHtml(details.formattedPhaseEnglish)}</b>`,
    `• ខែចន្ទគតិ: <b>ខែ${escapeHtml(details.lunarMonthName)}</b>`,
    `• ឆ្នាំសត្វ: ${details.animalYearEmoji} <b>ឆ្នាំ${escapeHtml(details.animalYearNameKhmer)} (${escapeHtml(details.animalYearNameEnglish)})</b>`,
    `• ស័ក: <b>${escapeHtml(details.sakNameKhmer)} (${details.sakNumber})</b>`,
    `• ពុទ្ធសករាជ: <b>${escapeHtml(details.beYearKhmer)} (${details.beYear} B.E.)</b></blockquote>`,
    '',
    `🪷 <b>ថ្ងៃសីល (Holy Day):</b> ${silBadge}`,
    `🎉 <b>បុណ្យជាតិ (Holiday):</b> ${holidayBadge}`,
    '──────────────────────────',
    '💡 <i>ចុច /today ដើម្បីមើលថ្ងៃនេះ ឬ /sil ដើម្បីមើលថ្ងៃសីល</i>'
  ].join('\n');
}
