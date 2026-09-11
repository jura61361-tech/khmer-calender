import momentkhModule from '@thyrith/momentkh';
import { DateTime } from 'luxon';

// Handle both CJS and ESM module exports
const momentkh: any = (momentkhModule as any).default || momentkhModule;

export const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerDigits(val: number | string): string {
  return String(val).replace(/[0-9]/g, (digit) => KHMER_DIGITS[parseInt(digit, 10)]);
}

export const ANIMAL_YEAR_TRANSLATIONS: Record<string, { en: string; emoji: string }> = {
  'ជូត': { en: 'Rat', emoji: '🐀' },
  'ឆ្លូវ': { en: 'Ox', emoji: '🐂' },
  'ខាល': { en: 'Tiger', emoji: '🐅' },
  'ថោះ': { en: 'Rabbit', emoji: '🐇' },
  'រោង': { en: 'Dragon', emoji: '🐉' },
  'ម្សាញ់': { en: 'Snake', emoji: '🐍' },
  'មមី': { en: 'Horse', emoji: '🐎' },
  'មមែ': { en: 'Goat', emoji: '🐐' },
  'វក': { en: 'Monkey', emoji: '🐒' },
  'រកា': { en: 'Rooster', emoji: '🐓' },
  'ច': { en: 'Dog', emoji: '🐕' },
  'កុរ': { en: 'Pig', emoji: '🐖' }
};

export const GREGORIAN_MONTHS = [
  { kh: 'មករា', en: 'January' },
  { kh: 'កុម្ភៈ', en: 'February' },
  { kh: 'មីនា', en: 'March' },
  { kh: 'មេសា', en: 'April' },
  { kh: 'ឧសភា', en: 'May' },
  { kh: 'មិថុនា', en: 'June' },
  { kh: 'កក្កដា', en: 'July' },
  { kh: 'សីហា', en: 'August' },
  { kh: 'កញ្ញា', en: 'September' },
  { kh: 'តុលា', en: 'October' },
  { kh: 'វិច្ឆិកា', en: 'November' },
  { kh: 'ធ្នូ', en: 'December' }
];

export const WEEKDAYS = [
  { kh: 'ថ្ងៃអាទិត្យ', en: 'Sunday' },
  { kh: 'ថ្ងៃចន្ទ', en: 'Monday' },
  { kh: 'ថ្ងៃអង្គារ', en: 'Tuesday' },
  { kh: 'ថ្ងៃពុធ', en: 'Wednesday' },
  { kh: 'ថ្ងៃព្រហស្បតិ៍', en: 'Thursday' },
  { kh: 'ថ្ងៃសុក្រ', en: 'Friday' },
  { kh: 'ថ្ងៃសៅរ៍', en: 'Saturday' }
];

export interface KhmerLunarDetails {
  // Gregorian details
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  weekdayKhmer: string;
  weekdayEnglish: string;
  solarMonthKhmer: string;
  solarMonthEnglish: string;
  formattedSolarKhmer: string;   // e.g. ថ្ងៃសៅរ៍ ទី៥ ខែកញ្ញា ឆ្នាំ២០២៦
  formattedSolarEnglish: string; // e.g. Saturday, September 5, 2026

  // Khmer Lunisolar details
  dayNumber: number;             // 1-15
  dayNumberKhmer: string;        // e.g. ៨
  moonPhase: number;             // 0 = Waxing (កើត), 1 = Waning (រោច)
  moonPhaseNameKhmer: string;    // "កើត" or "រោច"
  moonPhaseNameEnglish: string;  // "Waxing Moon" or "Waning Moon"
  monthIndex: number;
  lunarMonthName: string;        // e.g. "ស្រាពណ៍", "ភទ្របទ"
  beYear: number;                // e.g. 2570
  beYearKhmer: string;           // e.g. ២៥៧០
  jsYear: number;                // Jolak Sakaraj
  animalYearNameKhmer: string;   // e.g. "មមី"
  animalYearNameEnglish: string; // e.g. "Horse"
  animalYearEmoji: string;       // e.g. "🐎"
  sakNameKhmer: string;          // e.g. "អដ្ឋស័ក"
  sakNumber: number;             // 0 to 9
  formattedLunarKhmer: string;   // e.g. ៨រោច ខែស្រាពណ៍ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០
  formattedPhaseEnglish: string; // e.g. 8th Waning Moon (រោច)
}

export function getSafeNow(timezone?: string): DateTime {
  let cleanTz = typeof timezone === 'string' ? timezone.trim().replace(/['"]/g, '') : '';
  if (!cleanTz) {
    cleanTz = 'Asia/Phnom_Penh';
  }

  try {
    const dt = DateTime.now().setZone(cleanTz);
    if (dt.isValid) return dt;
  } catch {}

  try {
    // Cambodia is UTC+7 with no DST. UTC+7 is always supported everywhere.
    const dt = DateTime.now().setZone('UTC+7');
    if (dt.isValid) return dt;
  } catch {}

  return DateTime.now();
}

/**
 * Convert a year, month (1-12), day into complete Khmer Lunar Details
 */
export function getKhmerDate(year: number, month: number, day: number): KhmerLunarDetails {
  const safeYear = Number.isFinite(year) && year > 0 ? Math.floor(year) : new Date().getFullYear();
  const safeMonth = Number.isFinite(month) && month >= 1 && month <= 12 ? Math.floor(month) : (new Date().getMonth() + 1);
  const safeDay = Number.isFinite(day) && day >= 1 && day <= 31 ? Math.floor(day) : new Date().getDate();

  const khmerRaw = momentkh.fromGregorian(safeYear, safeMonth, safeDay);
  const k = khmerRaw.khmer;
  const g = khmerRaw.gregorian;

  // Day of week from Gregorian (0 = Sun ... 6 = Sat)
  let dt = DateTime.fromObject({ year: safeYear, month: safeMonth, day: safeDay }, { zone: 'Asia/Phnom_Penh' });
  if (!dt.isValid) {
    dt = DateTime.fromObject({ year: safeYear, month: safeMonth, day: safeDay }, { zone: 'UTC+7' });
  }
  const dayOfWeek = dt.isValid ? dt.weekday % 7 : new Date(safeYear, safeMonth - 1, safeDay).getDay();
  const weekdayInfo = WEEKDAYS[dayOfWeek] || WEEKDAYS[0];
  const monthInfo = GREGORIAN_MONTHS[safeMonth - 1] || GREGORIAN_MONTHS[0];

  const dayKh = toKhmerDigits(day);
  const yearKh = toKhmerDigits(year);
  const beYearKh = toKhmerDigits(k.beYear);
  const lunarDayKh = toKhmerDigits(k.day);

  const animalTranslation = ANIMAL_YEAR_TRANSLATIONS[k.animalYearName] || { en: 'Unknown', emoji: '🐾' };
  const moonPhaseEn = k.moonPhase === 0 ? 'Waxing Moon' : 'Waning Moon';

  // Ordinal suffix for English (e.g. 1st, 2nd, 3rd, 8th)
  const getOrdinalSuffix = (n: number) => {
    if (n >= 11 && n <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  };

  const formattedSolarKhmer = `${weekdayInfo.kh} ទី${dayKh} ខែ${monthInfo.kh} ឆ្នាំ${yearKh}`;
  const formattedSolarEnglish = `${weekdayInfo.en}, ${monthInfo.en} ${day}, ${year}`;
  const formattedLunarKhmer = `${lunarDayKh}${k.moonPhaseName} ខែ${k.monthName} ឆ្នាំ${k.animalYearName} ${k.sakName} ព.ស. ${beYearKh}`;
  const formattedPhaseEnglish = `${getOrdinalSuffix(k.day)} ${moonPhaseEn} (${k.moonPhaseName})`;

  return {
    year,
    month,
    day,
    dayOfWeek,
    weekdayKhmer: weekdayInfo.kh,
    weekdayEnglish: weekdayInfo.en,
    solarMonthKhmer: monthInfo.kh,
    solarMonthEnglish: monthInfo.en,
    formattedSolarKhmer,
    formattedSolarEnglish,
    dayNumber: k.day,
    dayNumberKhmer: lunarDayKh,
    moonPhase: k.moonPhase,
    moonPhaseNameKhmer: k.moonPhaseName,
    moonPhaseNameEnglish: moonPhaseEn,
    monthIndex: k.monthIndex,
    lunarMonthName: k.monthName,
    beYear: k.beYear,
    beYearKhmer: beYearKh,
    jsYear: k.jsYear,
    animalYearNameKhmer: k.animalYearName,
    animalYearNameEnglish: animalTranslation.en,
    animalYearEmoji: animalTranslation.emoji,
    sakNameKhmer: k.sakName,
    sakNumber: k.sak,
    formattedLunarKhmer,
    formattedPhaseEnglish
  };
}

/**
 * Get Khmer date for today in Asia/Phnom_Penh timezone
 */
export function getKhmerDateToday(timezone = 'Asia/Phnom_Penh'): KhmerLunarDetails {
  const now = DateTime.now().setZone(timezone);
  return getKhmerDate(now.year, now.month, now.day);
}

/**
 * Parse a YYYY-MM-DD date string safely and return KhmerLunarDetails
 */
export function parseAndGetKhmerDate(dateStr: string): KhmerLunarDetails {
  const dt = DateTime.fromISO(dateStr, { zone: 'Asia/Phnom_Penh' });
  if (!dt.isValid) {
    throw new Error(`Invalid date format: "${dateStr}". Please use YYYY-MM-DD (e.g. 2026-09-05).`);
  }
  return getKhmerDate(dt.year, dt.month, dt.day);
}

export { momentkh };
