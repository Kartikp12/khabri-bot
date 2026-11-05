
require("dotenv").config();
require("./database");
const TelegramBot = require("node-telegram-bot-api");
const handleStart = require("./start");
const handleHelp = require("./help");
const handleAbout = require("./about");
const handleAdd = require("./add");
const handleList = require("./list");
const handleRemove = require("./remove");
const handleStatus = require("./status");
const startMonitoring = require("./monitor");



const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing. Please check your .env file.");
}

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("Khabri is starting...");
handleStart(bot);
handleHelp(bot);
handleAbout(bot);
handleAdd(bot);
handleList(bot);
handleRemove(bot);
handleStatus(bot);
startMonitoring(bot);


bot.on("polling_error", (error) => {
  console.error("Telegram polling error:", error.message);
});

bot.on("error", (error) => {
  console.error("Bot error:", error.message);
});
