import { DateTime } from 'luxon';
import { getKhmerDate, toKhmerDigits, KhmerLunarDetails } from './lunar.js';

export interface HolyDayCheckResult {
  isHolyDay: boolean;
  phaseLabelKhmer?: string;
  phaseLabelEnglish?: string;
  details?: KhmerLunarDetails;
}

export interface UpcomingHolyDay {
  gregorianDate: string; // YYYY-MM-DD
  daysRemaining: number;
  formattedSolarKhmer: string;
  formattedSolarEnglish: string;
  formattedLunarKhmer: string;
  phaseLabelKhmer: string;
  phaseLabelEnglish: string;
  isToday: boolean;
}

/**
 * Check whether a specific date is a Buddhist Holy Day (ថ្ងៃសីល - Thngai Sil)
 */
export function checkHolyDay(year: number, month: number, day: number): HolyDayCheckResult {
  const current = getKhmerDate(year, month, day);
  const { moonPhase, dayNumber, dayNumberKhmer } = current;

  // 1. ៨កើត (8th Waxing)
  if (moonPhase === 0 && dayNumber === 8) {
    return {
      isHolyDay: true,
      phaseLabelKhmer: '៨កើត',
      phaseLabelEnglish: '8th Waxing Moon (៨កើត)',
      details: current
    };
  }

  // 2. ១៥កើត (15th Waxing - Full Moon / ពេញបូណ៌មី)
  if (moonPhase === 0 && dayNumber === 15) {
    return {
      isHolyDay: true,
      phaseLabelKhmer: '១៥កើត (ពេញបូណ៌មី)',
      phaseLabelEnglish: '15th Waxing Moon - Full Moon (១៥កើត ពេញបូណ៌មី)',
      details: current
    };
  }

  // 3. ៨រោច (8th Waning)
  if (moonPhase === 1 && dayNumber === 8) {
    return {
      isHolyDay: true,
      phaseLabelKhmer: '៨រោច',
      phaseLabelEnglish: '8th Waning Moon (៨រោច)',
      details: current
    };
  }

  // 4. End of Month (New Moon / ថ្ងៃដាច់ខែ: 14 or 15 Waning)
  if (moonPhase === 1) {
    const dt = DateTime.fromObject({ year, month, day }, { zone: 'Asia/Phnom_Penh' });
    const tomorrowDt = dt.plus({ days: 1 });
    const tomorrowKhmer = getKhmerDate(tomorrowDt.year, tomorrowDt.month, tomorrowDt.day);

    // If tomorrow is Waxing (1st Kert of next month), today is the last day of the lunar month
    if (tomorrowKhmer.moonPhase === 0) {
      return {
        isHolyDay: true,
        phaseLabelKhmer: `${dayNumberKhmer}រោច (ដាច់ខែ)`,
        phaseLabelEnglish: `${dayNumber}th Waning Moon - New Moon (${dayNumberKhmer}រោច ដាច់ខែ)`,
        details: current
      };
    }
  }

  return { isHolyDay: false, details: current };
}

/**
 * Check if today is a holy day in Phnom Penh timezone
 */
export function isTodayHolyDay(timezone = 'Asia/Phnom_Penh'): HolyDayCheckResult {
  const now = DateTime.now().setZone(timezone);
  return checkHolyDay(now.year, now.month, now.day);
}

/**
 * Get upcoming Buddhist Holy Days starting from a reference date
 * @param fromDate Starting DateTime (defaults to now in Asia/Phnom_Penh)
 * @param count Number of upcoming holy days to return (default 4)
 * @param includeTodayIfHoly Include today if today is already a holy day (default true)
 */
export function getUpcomingHolyDays(
  fromDate?: DateTime,
  count = 4,
  includeTodayIfHoly = true
): UpcomingHolyDay[] {
  const start = (fromDate || DateTime.now().setZone('Asia/Phnom_Penh')).startOf('day');
  const results: UpcomingHolyDay[] = [];

  for (let offset = 0; results.length < count && offset <= 60; offset++) {
    const currentDt = start.plus({ days: offset });
    const check = checkHolyDay(currentDt.year, currentDt.month, currentDt.day);

    if (check.isHolyDay && check.details) {
      const daysRemaining = offset;

      if (daysRemaining === 0 && !includeTodayIfHoly) {
        continue;
      }

      results.push({
        gregorianDate: currentDt.toISODate() || `${currentDt.year}-${currentDt.month}-${currentDt.day}`,
        daysRemaining,
        formattedSolarKhmer: check.details.formattedSolarKhmer,
        formattedSolarEnglish: check.details.formattedSolarEnglish,
        formattedLunarKhmer: check.details.formattedLunarKhmer,
        phaseLabelKhmer: check.phaseLabelKhmer || '',
        phaseLabelEnglish: check.phaseLabelEnglish || '',
        isToday: daysRemaining === 0
      });
    }
  }

  return results;
}
