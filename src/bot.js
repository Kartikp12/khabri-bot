
require("dotenv").config();

const db = require("./database");
const TelegramBot = require("node-telegram-bot-api");

const handleStart = require("./start");
const handleHelp = require("./help");
const handleAbout = require("./about");
const handleAdd = require("./add");
const handleList = require("./list");
const handleRemove = require("./remove");
const handleStatus = require("./status");
const startMonitoring = require("./monitor");
const handlePause = require("./pause");
const handleResume = require("./resume");
const handleReport = require("./report");
const handleClear = require("./clear");
const handleReset = require("./reset");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing. Please check your .env file.");
}

const bot = new TelegramBot(token, {
  polling: true,
});

// Track every text message sent by the bot
const originalSendMessage = bot.sendMessage.bind(bot);

bot.sendMessage = async (chatId, text, options) => {
  const sentMessage = await originalSendMessage(
    chatId,
    text,
    options
  );

  try {
    db.prepare(`
      INSERT OR IGNORE INTO bot_messages (chat_id, message_id)
      VALUES (?, ?)
    `).run(String(chatId), sentMessage.message_id);
  } catch (error) {
    console.error("Message tracking error:", error.message);
  }

  return sentMessage;
};

console.log("Khabri is starting...");

handleStart(bot);
handleHelp(bot);
handleAbout(bot);
handleAdd(bot);
handleList(bot);
handleRemove(bot);
handleStatus(bot);
startMonitoring(bot);
handlePause(bot);
handleResume(bot);
handleReport(bot);
handleClear(bot);
handleReset(bot);

bot.on("polling_error", (error) => {
  console.error("Telegram polling error:", error.message);
});

bot.on("error", (error) => {
  console.error("Bot error:", error.message);
});
