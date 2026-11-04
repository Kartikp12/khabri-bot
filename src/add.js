const db = require("./database");

function handleAdd(bot) {
  bot.onText(/\/add(?:\s+(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);
    const url = match[1]?.trim();

    if (!url) {
      return bot.sendMessage(
        chatId,
        "Please provide a website URL.\n\nExample:\n/add https://example.com"
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return bot.sendMessage(chatId, "Invalid URL. Please enter a valid website URL.");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return bot.sendMessage(chatId, "Only HTTP and HTTPS websites are supported.");
    }

    if (parsedUrl.username || parsedUrl.password) {
      return bot.sendMessage(chatId, "URLs containing login credentials are not allowed.");
    }

    const existingWebsite = db
      .prepare("SELECT id FROM websites WHERE telegram_id = ?")
      .get(telegramId);

    if (existingWebsite) {
      return bot.sendMessage(
        chatId,
        "You already have a website registered.\n\nOnly one website per user is allowed."
      );
    }

    try {
      db.prepare(
        "INSERT INTO websites (telegram_id, url) VALUES (?, ?)"
      ).run(telegramId, parsedUrl.href);

      bot.sendMessage(
        chatId,
        `✅ Website added successfully!\n\n🌐 ${parsedUrl.href}\n\nKhabri will monitor your website soon.`
      );
    } catch (error) {
      console.error("Add website error:", error.message);
      bot.sendMessage(chatId, "Something went wrong while adding your website. Please try again.");
    }
  });
}

module.exports = handleAdd;