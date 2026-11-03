
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing. Please check your .env file.");
}

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("Khabri is starting...");

bot.on("polling_error", (error) => {
  console.error("Telegram polling error:", error.message);
});

bot.on("error", (error) => {
  console.error("Bot error:", error.message);
});
