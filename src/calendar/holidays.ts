import { DateTime } from 'luxon';
import { getKhmerDate, momentkh } from './lunar.js';

export interface Holiday {
  nameKhmer: string;
  nameEnglish: string;
  isPublicHoliday: boolean;
  type: 'public_holiday' | 'cultural_observance';
  description?: string;
}

export interface UpcomingHolidayItem extends Holiday {
  gregorianDate: string; // YYYY-MM-DD
  daysRemaining: number;
  formattedSolarKhmer: string;
  formattedSolarEnglish: string;
  formattedLunarKhmer: string;
  isToday: boolean;
}

// Fixed solar holidays (Month is 1-12, Day is 1-31)
interface SolarHolidayDef {
  month: number;
  day: number;
  nameKhmer: string;
  nameEnglish: string;
  isPublicHoliday: boolean;
  type: 'public_holiday' | 'cultural_observance';
}

const FIXED_SOLAR_HOLIDAYS: SolarHolidayDef[] = [
  {
    month: 1,
    day: 1,
    nameKhmer: 'ទិវាចូលឆ្នាំសកល',
    nameEnglish: 'International New Year Day',
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 1,
    day: 7,
    nameKhmer: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEnglish: 'Victory over Genocide Day',
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 3,
    day: 8,
    nameKhmer: 'ទិវាអន្តរជាតិនារី',
    nameEnglish: "International Women's Rights Day",
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 5,
    day: 1,
    nameKhmer: 'ទិវាពលកម្មអន្តរជាតិ',
    nameEnglish: 'International Labour Day',
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 5,
    day: 14,
    nameKhmer: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី',
    nameEnglish: "King Norodom Sihamoni's Birthday",
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 6,
    day: 18,
    nameKhmer: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ',
    nameEnglish: "Queen Mother Norodom Monineath Sihanouk's Birthday",
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 9,
    day: 24,
    nameKhmer: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    nameEnglish: 'National Constitutional Day',
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 10,
    day: 15,
    nameKhmer: 'ទិវារំលឹកវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេច ព្រះនរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ',
    nameEnglish: 'Commemoration Day of King Father Norodom Sihanouk',
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 10,
    day: 29,
    nameKhmer: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ ព្រះករុណា ព្រះបាទសម្តេច ព្រះបរមនាថ នរោត្តម សីហមុនី',
    nameEnglish: "King Norodom Sihamoni's Coronation Day",
    isPublicHoliday: true,
    type: 'public_holiday'
  },
  {
    month: 11,
    day: 9,
    nameKhmer: 'ទិវាបុណ្យឯករាជ្យជាតិ',
    nameEnglish: 'National Independence Day',
    isPublicHoliday: true,
    type: 'public_holiday'
  }
];

/**
 * Check if the given date is part of Khmer New Year
 */
function checkKhmerNewYear(year: number, month: number, day: number): Holiday | null {
  try {
    const ny = momentkh.getNewYear(year);
    if (!ny || !ny.day || !ny.month) return null;

    // Check 3 consecutive days: Moha Songkran, Virak Vanabat, Vearak Loeng Sak
    const nyStart = DateTime.fromObject({ year: ny.year, month: ny.month, day: ny.day });
    const target = DateTime.fromObject({ year, month, day });

    const diffDays = Math.round(target.diff(nyStart, 'days').days);

    if (diffDays === 0) {
      return {
        nameKhmer: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (ថ្ងៃមហាសង្ក្រាន្ត)',
        nameEnglish: 'Khmer New Year (Moha Songkran)',
        isPublicHoliday: true,
        type: 'public_holiday'
      };
    } else if (diffDays === 1) {
      return {
        nameKhmer: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (ថ្ងៃវារៈវ័នបត)',
        nameEnglish: 'Khmer New Year (Virak Vanabat)',
        isPublicHoliday: true,
        type: 'public_holiday'
      };
    } else if (diffDays === 2) {
      return {
        nameKhmer: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (ថ្ងៃវារៈឡើងស័ក)',
        nameEnglish: 'Khmer New Year (Vearak Loeng Sak)',
        isPublicHoliday: true,
        type: 'public_holiday'
      };
    } else if (diffDays === 3) {
      // In some leap years, Khmer New Year is observed for 4 days
      return {
        nameKhmer: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (ថ្ងៃទី៤)',
        nameEnglish: 'Khmer New Year (Day 4)',
        isPublicHoliday: true,
        type: 'public_holiday'
      };
    }
  } catch {
    // Ignore calculation error for edge years
  }
  return null;
}

/**
 * Check if the given date matches Khmer lunisolar holidays
 */
function checkLunisolarHolidays(year: number, month: number, day: number): Holiday[] {
  const holidays: Holiday[] = [];
  const k = getKhmerDate(year, month, day);

  const { monthIndex, moonPhase, dayNumber } = k;

  // 1. Meak Bochea (បុណ្យមាឃបូជា): 15 Kert Khae Meak (monthIndex = 2)
  if (monthIndex === 2 && moonPhase === 0 && dayNumber === 15) {
    holidays.push({
      nameKhmer: 'ពិធីបុណ្យមាឃបូជា',
      nameEnglish: 'Meak Bochea Day',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // 2. Visakh Bochea (បុណ្យវិសាខបូជា): 15 Kert Khae Pisakh (monthIndex = 5)
  if (monthIndex === 5 && moonPhase === 0 && dayNumber === 15) {
    holidays.push({
      nameKhmer: 'ពិធីបុណ្យវិសាខបូជា',
      nameEnglish: 'Visak Bochea Day',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // 3. Royal Ploughing Ceremony (ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល): 4 Roch Khae Pisakh (monthIndex = 5)
  if (monthIndex === 5 && moonPhase === 1 && dayNumber === 4) {
    holidays.push({
      nameKhmer: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
      nameEnglish: 'Royal Ploughing Ceremony',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // 4. Kan Ben 1 (កាន់បិណ្ឌ ១): 1 Roch Khae Phatrabot (monthIndex = 9)
  if (monthIndex === 9 && moonPhase === 1 && dayNumber === 1) {
    holidays.push({
      nameKhmer: 'ពិធីកាន់បិណ្ឌ ១ (ចាប់ផ្ដើមពិធីបុណ្យភ្ជុំបិណ្ឌ)',
      nameEnglish: 'Kan Ben 1 (Beginning of Pchum Ben)',
      isPublicHoliday: false,
      type: 'cultural_observance'
    });
  }

  // 5. Pchum Ben 3-day public holiday:
  // - 14 Roch Khae Phatrabot (monthIndex = 9)
  if (monthIndex === 9 && moonPhase === 1 && dayNumber === 14) {
    holidays.push({
      nameKhmer: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃកាន់បិណ្ឌ ១៤ / ភ្ជុំបិណ្ឌ ថ្ងៃទី១)',
      nameEnglish: 'Pchum Ben Festival (Day 1)',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // - 15 Roch Khae Phatrabot (monthIndex = 9) -> ថ្ងៃភ្ជុំធំ
  if (monthIndex === 9 && moonPhase === 1 && dayNumber === 15) {
    holidays.push({
      nameKhmer: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃភ្ជុំធំ)',
      nameEnglish: 'Pchum Ben Festival (Main Day)',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // - 1 Kert Khae Assoch (monthIndex = 10) -> ថ្ងៃបញ្ចប់បុណ្យភ្ជុំបិណ្ឌ
  if (monthIndex === 10 && moonPhase === 0 && dayNumber === 1) {
    holidays.push({
      nameKhmer: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី៣)',
      nameEnglish: 'Pchum Ben Festival (Day 3)',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  // 6. Water Festival (ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក)
  // MonthIndex 11 = Kadeuk
  if (monthIndex === 11 && moonPhase === 0 && dayNumber === 14) {
    holidays.push({
      nameKhmer: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប (ថ្ងៃទី១)',
      nameEnglish: 'Water Festival Ceremony (Day 1)',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  if (monthIndex === 11 && moonPhase === 0 && dayNumber === 15) {
    holidays.push({
      nameKhmer: 'ព្រះរាជពិធីបុណ្យអុំទូក (សំពះព្រះខែ និងអកអំបុក)',
      nameEnglish: 'Water Festival & Moon Worship / Ok Ambok',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  if (monthIndex === 11 && moonPhase === 1 && dayNumber === 1) {
    holidays.push({
      nameKhmer: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប (ថ្ងៃទី៣)',
      nameEnglish: 'Water Festival Ceremony (Day 3)',
      isPublicHoliday: true,
      type: 'public_holiday'
    });
  }

  return holidays;
}

/**
 * Get all holidays for a given Gregorian date
 */
export function getHolidaysForDate(year: number, month: number, day: number): Holiday[] {
  const holidays: Holiday[] = [];

  // Check fixed solar holidays
  for (const h of FIXED_SOLAR_HOLIDAYS) {
    if (h.month === month && h.day === day) {
      holidays.push({
        nameKhmer: h.nameKhmer,
        nameEnglish: h.nameEnglish,
        isPublicHoliday: h.isPublicHoliday,
        type: h.type
      });
    }
  }

  // Check Khmer New Year
  const nyHoliday = checkKhmerNewYear(year, month, day);
  if (nyHoliday) {
    holidays.push(nyHoliday);
  }

  // Check lunisolar holidays
  const lunarHolidays = checkLunisolarHolidays(year, month, day);
  holidays.push(...lunarHolidays);

  return holidays;
}

/**
 * Get upcoming Cambodian holidays starting from a reference date
 */
export function getUpcomingHolidays(
  fromDate?: DateTime,
  limit = 5,
  includeToday = true
): UpcomingHolidayItem[] {
  const start = (fromDate || DateTime.now().setZone('Asia/Phnom_Penh')).startOf('day');
  const results: UpcomingHolidayItem[] = [];

  // Search forward up to 365 days
  for (let offset = 0; results.length < limit && offset <= 365; offset++) {
    const current = start.plus({ days: offset });
    const holidays = getHolidaysForDate(current.year, current.month, current.day);

    for (const h of holidays) {
      if (offset === 0 && !includeToday) {
        continue;
      }

      const k = getKhmerDate(current.year, current.month, current.day);

      results.push({
        ...h,
        gregorianDate: current.toISODate() || `${current.year}-${current.month}-${current.day}`,
        daysRemaining: offset,
        formattedSolarKhmer: k.formattedSolarKhmer,
        formattedSolarEnglish: k.formattedSolarEnglish,
        formattedLunarKhmer: k.formattedLunarKhmer,
        isToday: offset === 0
      });

      if (results.length >= limit) break;
    }
  }

  return results;
}
