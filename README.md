# 🚀 Khabri — Website Monitoring Telegram Bot

**Stay alert. Stay informed.**

Khabri is a Telegram-based website monitoring bot that helps you keep track of your website's availability. It automatically checks registered websites every 5 minutes and sends alerts when a website goes down or recovers.

No dashboard. No complicated setup. Just real-time website monitoring directly through Telegram.

## ✨ Features

- **Automated Monitoring** — Checks website availability every 5 minutes.
- **Downtime Detection** — Sends an alert after 2 consecutive failed checks.
- **Recovery Notifications** — Notifies you when your website comes back online.
- **Website Management** — Add, view, check, and remove your registered website.
- **Pause & Resume** — Control automatic monitoring whenever you need.
- **24-Hour Uptime Reports** — View uptime percentage, successful checks, failed checks, and average response time.
- **Automatic Data Cleanup** — Removes monitoring history older than 24 hours.
- **Clear Chat** — Deletes tracked messages sent by Khabri, with confirmation.
- **Account Reset** — Permanently deletes your registered website and monitoring data, with confirmation.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| JavaScript | Application logic |
| Telegram Bot API | Bot communication |
| SQLite | Persistent data storage |
| better-sqlite3 | Database operations |
| Axios | HTTP requests |
| node-cron | Scheduled monitoring |
| dotenv | Environment configuration |

## 📋 Available Commands

| Command | Description |
|---|---|
| `/start` | Start Khabri |
| `/help` | View available commands |
| `/about` | Learn about Khabri |
| `/add <url>` | Register a website |
| `/list` | View registered website |
| `/status` | Check website status instantly |
| `/remove` | Remove registered website |
| `/pause` | Pause automatic monitoring |
| `/resume` | Resume automatic monitoring |
| `/report` | View the last 24 hours uptime report |
| `/clear` | Clear tracked messages sent by Khabri |
| `/reset` | Permanently delete your Khabri account data |

**Note:** Khabri currently supports one registered website per Telegram user.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- A Telegram account
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

### 1. Clone the repository

```bash
git clone https://github.com/Kartikp12/khabri-bot.git

cd khabri-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
BOT_TOKEN=your_telegram_bot_token
```

Replace the placeholder with your Telegram bot token.

### 4. Start the bot

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

Your Khabri bot is now running!

## 📁 Project Structure

```text
khabri-bot/
│
├── src/
│   ├── bot.js
│   ├── database.js
│   ├── start.js
│   ├── help.js
│   ├── about.js
│   ├── add.js
│   ├── list.js
│   ├── remove.js
│   ├── status.js
│   ├── websiteChecker.js
│   ├── monitor.js
│   ├── pause.js
│   ├── resume.js
│   ├── report.js
│   ├── clear.js
│   └── reset.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔔 Monitoring Logic

Khabri follows a simple monitoring workflow:

1. A user registers a website using `/add`.
2. The monitoring scheduler checks the website every 5 minutes.
3. Successful HTTP responses (2xx and 3xx) are considered online.
4. Failed checks increment the consecutive failure count.
5. After 2 consecutive failures, Khabri sends a downtime alert.
6. When the website responds successfully again, Khabri sends a recovery notification.
7. Monitoring history is maintained for a rolling 24-hour reporting window.

## 🗄️ Database

Khabri uses SQLite with two primary tables:

- `websites` — Stores registered websites, monitoring status, failure counts, and user settings.
- `website_history` — Stores historical website checks, HTTP status codes, and response times.

An additional `bot_messages` table tracks messages sent by Khabri for the `/clear` command.

## 🔐 Important Notes

- Keep your Telegram bot token private.
- Do not commit `.env` or SQLite database files.
- `/clear` can delete only tracked messages sent by Khabri, subject to Telegram's message deletion restrictions. It cannot delete messages sent by users.
- `/reset` permanently deletes the user's registered website and monitoring history after confirmation.
- The bot requires a continuously running Node.js process for polling and scheduled monitoring.
- Use persistent storage for the SQLite database in production.

## 🚀 Future Improvements

- Multiple website monitoring per user.
- Custom monitoring intervals.
- Response-time analytics and performance trends.
- More detailed monitoring reports.
- Additional notification preferences.

## 👨‍💻 Author

**Kartik Patil**

GitHub: [@Kartikp12](https://github.com/Kartikp12)

---

If you find Khabri useful, consider giving this repository a ⭐.

**Stay alert. Stay informed.**
