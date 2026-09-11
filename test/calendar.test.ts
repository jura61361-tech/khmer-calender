import assert from 'node:assert';
import { getKhmerDate, toKhmerDigits } from '../src/calendar/lunar.js';
import { checkHolyDay, getUpcomingHolyDays } from '../src/calendar/holyDays.js';
import { getHolidaysForDate, getUpcomingHolidays } from '../src/calendar/holidays.js';
import { getCalendarDayReport, formatDailyBroadcast, formatUpcomingHolyDays, formatUpcomingHolidays, formatConvertResult } from '../src/calendar/formatter.js';

console.log('🧪 Starting Khmer Calendar Bot Test Suite...\n');

// Test 1: Khmer Digits conversion
console.log('Test 1: Khmer Digits Conversion');
assert.strictEqual(toKhmerDigits(2026), '២០២៦');
assert.strictEqual(toKhmerDigits(5), '៥');
assert.strictEqual(toKhmerDigits('15'), '១៥');
console.log('✅ Khmer digits conversion passed!\n');

// Test 2: Date Conversion for 2026-09-05 (Today)
console.log('Test 2: Date Conversion for 2026-09-05');
const kToday = getKhmerDate(2026, 9, 5);
assert.strictEqual(kToday.weekdayKhmer, 'ថ្ងៃសៅរ៍');
assert.strictEqual(kToday.weekdayEnglish, 'Saturday');
assert.strictEqual(kToday.solarMonthKhmer, 'កញ្ញា');
assert.strictEqual(kToday.lunarMonthName, 'ស្រាពណ៍');
assert.strictEqual(kToday.dayNumber, 8);
assert.strictEqual(kToday.moonPhase, 1); // Waning / រោច
assert.strictEqual(kToday.beYear, 2570);
assert.strictEqual(kToday.animalYearNameKhmer, 'មមី');
assert.strictEqual(kToday.sakNameKhmer, 'អដ្ឋស័ក');
console.log('  Khmer Date:', kToday.formattedLunarKhmer);
console.log('  Solar Date:', kToday.formattedSolarKhmer);
console.log('✅ 2026-09-05 conversion passed!\n');

// Test 3: Buddhist Holy Day (ថ្ងៃសីល) detection
console.log('Test 3: Holy Day (ថ្ងៃសីល) Detection');
// 2026-09-05 is 8 Roch -> Holy Day
const silCheck1 = checkHolyDay(2026, 9, 5);
assert.strictEqual(silCheck1.isHolyDay, true);
assert.strictEqual(silCheck1.phaseLabelKhmer, '៨រោច');
console.log('  2026-09-05 is ថ្ងៃសីល:', silCheck1.phaseLabelKhmer);

// 2026-09-06 is 9 Roch -> NOT Holy Day
const silCheck2 = checkHolyDay(2026, 9, 6);
assert.strictEqual(silCheck2.isHolyDay, false);
console.log('  2026-09-06 is NOT ថ្ងៃសីល: Correct');

// 2026-09-11 is 14 Roch Khae Srap (Last day of lunar month) -> Holy Day
const silCheck3 = checkHolyDay(2026, 9, 11);
assert.strictEqual(silCheck3.isHolyDay, true);
console.log('  2026-09-11 (end of month) is ថ្ងៃសីល:', silCheck3.phaseLabelKhmer);

// 2026-09-19 is 8 Kert Khae Phatrabot -> Holy Day
const silCheck4 = checkHolyDay(2026, 9, 19);
assert.strictEqual(silCheck4.isHolyDay, true);
assert.strictEqual(silCheck4.phaseLabelKhmer, '៨កើត');
console.log('  2026-09-19 is ថ្ងៃសីល:', silCheck4.phaseLabelKhmer);

// 2026-09-26 is 15 Kert Khae Phatrabot -> Holy Day (Full Moon)
const silCheck5 = checkHolyDay(2026, 9, 26);
assert.strictEqual(silCheck5.isHolyDay, true);
console.log('  2026-09-26 (Full Moon) is ថ្ងៃសីល:', silCheck5.phaseLabelKhmer);
console.log('✅ Holy day tests passed!\n');

// Test 4: Cambodian Holidays Detection
console.log('Test 4: Cambodian Holidays Detection');
// International New Year
const h1 = getHolidaysForDate(2026, 1, 1);
assert.strictEqual(h1.length > 0, true);
assert.strictEqual(h1[0].nameKhmer, 'ទិវាចូលឆ្នាំសកល');

// Constitution Day (Sep 24)
const h2 = getHolidaysForDate(2026, 9, 24);
assert.strictEqual(h2.length > 0, true);
assert.strictEqual(h2[0].nameKhmer, 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ');

// Khmer New Year (Apr 14, 2026)
const h3 = getHolidaysForDate(2026, 4, 14);
assert.strictEqual(h3.length > 0, true);
assert.ok(h3[0].nameKhmer.includes('ចូលឆ្នាំថ្មី'));

// Pchum Ben Day (Oct 11, 2026)
const h4 = getHolidaysForDate(2026, 10, 11);
assert.strictEqual(h4.length > 0, true);
assert.ok(h4[0].nameKhmer.includes('ភ្ជុំបិណ្ឌ'));
console.log('  Found holidays: New Year, Constitution Day, Khmer New Year, Pchum Ben');
console.log('✅ Holiday tests passed!\n');

// Test 5: Message Formatting (Daily Template)
console.log('Test 5: Daily Broadcast Template Output');
const report = getCalendarDayReport(2026, 9, 5);
const broadcastMsg = formatDailyBroadcast(report);
console.log('--- PREVIEW DAILY POST ---');
console.log(broadcastMsg);
console.log('--- END PREVIEW ---');
assert.ok(broadcastMsg.includes('🇰🇭 <b>ប្រតិទិនចន្ទគតិខ្មែរ • DAILY KHMER CALENDAR</b>'));
assert.ok(broadcastMsg.includes('ថ្ងៃសៅរ៍ ទី៥ ខែកញ្ញា ឆ្នាំ២០២៦'));
assert.ok(broadcastMsg.includes('Saturday, September 5, 2026'));
assert.ok(broadcastMsg.includes('៨រោច ខែស្រាពណ៍ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០'));
assert.ok(broadcastMsg.includes('Phase: 8th Waning Moon (រោច)'));
assert.ok(broadcastMsg.includes('<code>#KhmerCalendar</code>'));
console.log('✅ Daily broadcast message verified against requested template!\n');

// Test 6: /convert Output
console.log('Test 6: /convert Output');
const convertMsg = formatConvertResult(report);
assert.ok(convertMsg.includes('🔄 <b>លទ្ធផលបម្លែងកាលបរិច្ឆេទ • DATE CONVERSION</b>'));
assert.ok(convertMsg.includes('មមី (Horse)'));
console.log('✅ /convert format verified!\n');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
