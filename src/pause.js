const db = require("./database");

function handlePause(bot) {
  bot.onText(/\/pause/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    try {
      const website = db
        .prepare("SELECT id, url, is_paused FROM websites WHERE telegram_id = ?")
        .get(telegramId);

      if (!website) {
        return bot.sendMessage(
          chatId,
          "You don't have any registered website.\n\nUse /add to register a website."
        );
      }

      if (website.is_paused === 1) {
        return bot.sendMessage(
          chatId,
          "⏸️ Your website monitoring is already paused."
        );
      }

      db.prepare(`
        UPDATE websites
        SET is_paused = 1
        WHERE telegram_id = ?
      `).run(telegramId);

      bot.sendMessage(
        chatId,
        `⏸️ Website monitoring paused successfully!\n\n🌐 Website: ${website.url}\n\nUse /resume whenever you want to start monitoring again.`
      );
    } catch (error) {
      console.error("Pause website error:", error.message);

      bot.sendMessage(
        chatId,
        "Unable to pause monitoring right now. Please try again."
      );
    }
  });
}

module.exports = handlePause;