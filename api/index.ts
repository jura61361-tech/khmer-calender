import type { IncomingMessage, ServerResponse } from 'node:http';
import { DateTime } from 'luxon';
import { getCalendarDayReport } from '../src/calendar/formatter.js';

/**
 * Vercel Serverless Function entry point for landing page and status overview
 * URL: https://<your-project>.vercel.app/
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // If request specifically wants JSON, return status JSON
  const acceptHeader = req.headers['accept'] || '';
  const now = DateTime.now().setZone('Asia/Phnom_Penh');
  const report = getCalendarDayReport(now.year, now.month, now.day);

  if (acceptHeader.includes('application/json')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        {
          service: 'Khmer Calendar Telegram Bot',
          status: 'online',
          platform: 'Vercel Serverless',
          timezone: 'Asia/Phnom_Penh',
          current_time: now.toISO(),
          today: {
            solar: report.solarKhmer,
            solar_en: report.solarEnglish,
            khmer_lunar: report.khmerDateFull,
            is_holy_day: report.isHolyDay,
            holy_day_title: report.holyDayTitle
          },
          endpoints: {
            webhook: '/api/bot',
            set_webhook: '/api/set-webhook',
            cron: '/api/cron'
          }
        },
        null,
        2
      )
    );
    return;
  }

  // HTML Status & Landing Page
  const html = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🇰🇭 Khmer Calendar Bot • Chhankitek</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 30, 49, 0.75);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent: #2563eb;
      --accent-glow: rgba(37, 99, 235, 0.35);
      --gold: #f59e0b;
      --gold-glow: rgba(245, 158, 11, 0.25);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --green: #10b981;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Kantumruy Pro', 'Outfit', sans-serif;
      background: radial-gradient(circle at 50% 0%, #172554 0%, #090d16 80%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .container {
      max-width: 640px;
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 36px 28px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px var(--accent-glow);
      text-align: center;
      position: relative;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      margin-bottom: 20px;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 28px;
    }
    .calendar-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 28px;
      text-align: left;
    }
    .calendar-header {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--gold);
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .calendar-solar {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .calendar-lunar {
      font-size: 16px;
      color: #38bdf8;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .holy-tag {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      background: ${report.isHolyDay ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.1)'};
      border: 1px solid ${report.isHolyDay ? 'rgba(245, 158, 11, 0.4)' : 'rgba(148, 163, 184, 0.2)'};
      color: ${report.isHolyDay ? '#fbbf24' : '#94a3b8'};
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 22px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      box-shadow: 0 4px 15px var(--accent-glow);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="badge-dot"></span>
      Vercel Serverless • Active
    </div>
    <h1>🇰🇭 Khmer Calendar Telegram Bot</h1>
    <p class="subtitle">ប្រតិទិនចន្ទគតិខ្មែរ • Lunisolar Engine & Daily Broadcast</p>

    <div class="calendar-card">
      <div class="calendar-header">
        <span>🌙</span> កាលបរិច្ឆេទថ្ងៃនេះ (Asia/Phnom_Penh)
      </div>
      <div class="calendar-solar">📅 ${report.solarKhmer}</div>
      <div class="calendar-lunar">🌙 ${report.khmerDateFull}</div>
      <div class="holy-tag">
        ${report.isHolyDay ? '🪷 ថ្ងៃនេះជាថ្ងៃសីល (' + report.holyDayTitle + ')' : '🪷 ថ្ងៃនេះមិនមែនជាថ្ងៃសីលទេ'}
      </div>
    </div>

    <div class="btn-group">
      <a href="/api/set-webhook" class="btn btn-primary" target="_blank">
        ⚡ Set Telegram Webhook
      </a>
      <a href="https://github.com/jura61361-tech/khmer-calender" class="btn btn-secondary" target="_blank">
        📂 GitHub Repository
      </a>
      <a href="/api/cron" class="btn btn-secondary" target="_blank">
        ⏰ Test Daily Cron
      </a>
    </div>

    <div class="footer">
      Powered by Node.js & grammY • Deployed on Vercel Serverless
    </div>
  </div>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}
