# 🇰🇭 Khmer Calendar Telegram Bot (Chhankitek / ចន្ទគតិ)

A production-ready Telegram Bot built with **Node.js**, **TypeScript**, and [`grammY`](https://grammy.dev/). It performs accurate offline calculations for the traditional Cambodian Lunisolar Calendar (**Chhankitek / ចន្ទគតិ**), posts automated daily updates at **06:00 AM (Asia/Phnom_Penh)** to a Telegram Channel, and provides interactive commands for groups and direct messages.

---

## ✨ Features

- 📅 **Automated Daily Channel Broadcast**: Posts every morning at 06:00 AM (`Asia/Phnom_Penh` timezone / UTC+7).
- 🌓 **Offline Khmer Lunisolar Logic**:
  - Solar Date (Gregorian) in Khmer & English
  - Waxing (កើត) and Waning (រោច) moon phases (1–15)
  - Khmer Lunar Month (ខែមិគសិរ, បុស្ស, មាឃ, ផល្គុន, ចេត្រ, ពិសាខ, ជេស្ឋ, អាសាឍ, ស្រាពណ៍, ភទ្របទ, អស្សុជ, កត្ដិក)
  - Buddhist Era (ពុទ្ធសករាជ ព.ស.) & Jolak Sakaraj (ច.ស.)
  - 12 Zodiac Animal Years (ជូត, ឆ្លូវ, ខាល, ថោះ, រោង, ម្សាញ់, មមី, មមែ, វក, រកា, ច, កុរ)
  - 10-Era Cycle (សំរឹទ្ធិស័ក, ឯកស័ក, ..., អដ្ឋស័ក, នព្វស័ក)
- 🪷 **Buddhist Holy Day (ថ្ងៃសីល - Thngai Sil) Engine**:
  - Automatically identifies: **៨កើត** (8th Waxing), **១៥កើត** (15th Waxing / Full Moon), **៨រោច** (8th Waning), and **ដាច់ខែ** (End of Month: 14th or 15th Waning).
  - Calculates upcoming holy days with days countdown.
- 🎉 **Cambodian National & Cultural Holidays**:
  - Fixed solar holidays (Independence Day, Victory Day, King's Birthday, etc.)
  - Moving lunisolar holidays (Meak Bochea, Khmer New Year, Visakh Bochea, Royal Ploughing Ceremony, Pchum Ben, Water Festival).
- 🔄 **Date Conversion (`/convert YYYY-MM-DD`)**: Convert any Gregorian date into its full Khmer lunar representation.
- 🐳 **Docker Ready**: Multi-stage Dockerfile and Docker Compose setup for fast deployment.

---

## 📋 Message Template Example

```
🇰🇭 ប្រតិទិនខ្មែរប្រចាំថ្ងៃ | Daily Khmer Calendar
━━━━━━━━━━━━━━━━━━━━━
📅 ថ្ងៃសៅរ៍ ទី៥ ខែកញ្ញា ឆ្នាំ២០២៦
🗓️ Saturday, September 5, 2026

🌙 ៨រោច ខែស្រាពណ៍ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០
Phase: 8th Waning Moon (រោច)

🪷 ថ្ងៃសីល (Buddhist Holy Day): បាទ/ចាស (Yes) - ៨រោច
🎉 បុណ្យជាតិ (Holiday): គ្មាន (None)
━━━━━━━━━━━━━━━━━━━━━
#KhmerCalendar #ប្រតិទិនខ្មែរ #ថ្ងៃសីល
```

---

## 🤖 Bot Commands

| Command | Description | Example |
| :--- | :--- | :--- |
| `/today` | Show today's complete Khmer lunar calendar card | `/today` |
| `/sil` | Check if today is ថ្ងៃសីល & list upcoming Buddhist Holy Days | `/sil` |
| `/holiday` | List upcoming Cambodian public holidays with countdown | `/holiday` |
| `/convert <YYYY-MM-DD>` | Convert any Gregorian date to Khmer lunar date | `/convert 2026-09-05` |
| `/start` or `/help` | Show introduction, help guide, and command list | `/start` |

---

## 🚀 Setup & Installation Guide

### Step 1: Create a Bot via @BotFather
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` and follow the prompts to choose a name and username (e.g. `@Khcalender_bot`).
3. Copy your **HTTP API Token** (e.g. `8945322393:AAGOvy_...`).

---

### Step 2: Add the Bot to Your Telegram Channel
1. Open your Telegram Channel.
2. Go to **Channel Settings** ➔ **Administrators** ➔ **Add Administrator**.
3. Search for your bot username (e.g. `@Khcalender_bot`) and add it.
4. Ensure the bot has permission to **Post Messages**.

---

### Step 3: Find Your `CHANNEL_ID`
You can configure either a public channel `@username` or a private channel numeric ID:

- **Public Channel**: Simply use the channel username (e.g. `@KhmerCalendarDaily`).
- **Private Channel**:
  1. Forward any message from the channel to [@userinfobot](https://t.me/userinfobot) or [@JsonDumpBot](https://t.me/JsonDumpBot).
  2. Copy the `Forward from chat` ID. Private channel IDs always start with `-100` (e.g. `-1001234567890`).

---

### Step 4: Configure Environment Variables
Copy the sample `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```ini
# Telegram Bot Token from @BotFather
BOT_TOKEN=8945322393:AAGOvy_fY3e4xWnuAeqeSKzskKb99Gg5wkQ

# Channel ID or username (where the bot is an Administrator)
CHANNEL_ID=@YourChannelUsernameOrId

# Daily broadcast schedule (Default: 06:00 AM daily)
CRON_SCHEDULE=0 6 * * *

# Timezone (Default: Asia/Phnom_Penh UTC+7)
TIMEZONE=Asia/Phnom_Penh
```

---

### Step 5: Run Locally

#### Prerequisites
- Node.js 18+ (tested on Node 22 & 24)
- npm or yarn

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Run Tests
Verify all lunar math and formatting tests pass:
```bash
npm test
```

#### 3. Development Mode (with auto-reload)
```bash
npm run dev
```

#### 4. Production Build & Run
```bash
npm run build
npm start
```

---

## 🐳 Deployment Guide

### Option A: Docker Compose (Recommended for VPS)
Run the bot as a background container on your server:

```bash
# 1. Clone or copy files to your server
git clone <your-repo> khmer-calendar
cd khmer-calendar

# 2. Configure .env
cp .env.example .env
nano .env

# 3. Build and launch with Docker Compose
docker compose up -d

# 4. View logs
docker compose logs -f
```

To stop the container:
```bash
docker compose down
```

---

---

### Option B: Cloud Hosting (Railway, Render, Fly.io)
1. Push your repository to GitHub.
2. In **Railway** or **Render**, create a **New Web Service / Worker Service** and connect your repository.
3. Set the following Environment Variables in the service settings:
   - `BOT_TOKEN`: `your_bot_token_here`
   - `CHANNEL_ID`: `@your_channel`
   - `CRON_SCHEDULE`: `0 6 * * *`
   - `TIMEZONE`: `Asia/Phnom_Penh`
4. Set the build and start commands:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

---

### Option C: Vercel Serverless (1-Click & Free)
This bot is pre-configured with Serverless Functions for Vercel:

1. **Push to GitHub**:
   Push this project to your GitHub repository.
2. **Import into Vercel**:
   - Log in to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository (`khmer-calender`).
   - In **Environment Variables**, add:
     - `BOT_TOKEN`: Your Telegram Bot token from [@BotFather](https://t.me/BotFather)
     - `CHANNEL_ID`: Your target Telegram channel (e.g. `@YourChannelUsername` or `-100...`)
     - `TIMEZONE`: `Asia/Phnom_Penh`
   - Click **Deploy**.
3. **Activate Webhook**:
   - Once deployed, visit your Vercel deployment URL in the browser:
     ```
     https://<your-project>.vercel.app/api/set-webhook
     ```
   - This automatically tells Telegram to send updates to your Vercel bot and configures the `/` commands menu!
4. **Daily Channel Broadcast**:
   - Vercel Cron is automatically configured in `vercel.json` to trigger `/api/cron` daily at **06:00 AM Phnom Penh time (23:00 UTC)**.

---

## 📁 Project Structure

```
khmer-calendar/
├── api/                        # Vercel Serverless Functions
│   ├── bot.ts                  # Telegram Webhook endpoint (/api/bot & /api/webhook)
│   ├── cron.ts                 # Scheduled daily channel broadcast endpoint (/api/cron)
│   ├── set-webhook.ts          # Automatic Telegram webhook & commands registrar
│   └── index.ts                # Web status dashboard & health overview
├── src/
│   ├── index.ts                # Application entrypoint for long-polling (Docker/Local/VPS)
│   ├── bot.ts                  # grammY bot setup, command registry, error handler
│   ├── config.ts               # Environment variable loader & validator
│   ├── scheduler.ts            # node-cron scheduler for daily channel broadcast
│   ├── calendar/
│   │   ├── lunar.ts            # Khmer lunisolar calculations & numeral conversion
│   │   ├── holyDays.ts         # Buddhist Holy Day (ថ្ងៃសីល) detection & schedule
│   │   ├── holidays.ts         # Cambodian national public holidays database
│   │   └── formatter.ts        # Dual-language Telegram card formatter
│   └── commands/
│       ├── start.ts            # /start & /help command
│       ├── today.ts            # /today command
│       ├── sil.ts              # /sil command
│       ├── holiday.ts          # /holiday command
│       └── convert.ts          # /convert <YYYY-MM-DD> command
├── test/
│   └── calendar.test.ts        # Automated unit and integration tests
├── .env.example                # Example environment file
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Multi-stage production container
├── docker-compose.yml          # Container orchestration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler config
├── vercel.json                 # Vercel Serverless routing & cron configuration
└── README.md                   # Documentation & setup guide
```

---

## 📜 License

MIT License.
Khmer calendar calculations powered by [`@thyrith/momentkh`](https://github.com/ThyrithSor/momentkh).
Bot framework powered by [`grammY`](https://grammy.dev/).
