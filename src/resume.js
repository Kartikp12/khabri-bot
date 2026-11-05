const db = require("./database");

function handleResume(bot) {
  bot.onText(/\/resume/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    try {
      const website = db
        .prepare(
          "SELECT id, url, is_paused FROM websites WHERE telegram_id = ?"
        )
        .get(telegramId);

      if (!website) {
        return bot.sendMessage(
          chatId,
          "You don't have any registered website.\n\nUse /add to register a website."
        );
      }

      if (website.is_paused === 0) {
        return bot.sendMessage(
          chatId,
          "▶️ Your website monitoring is already active."
        );
      }

      db.prepare(`
        UPDATE websites
        SET is_paused = 0,
            failure_count = 0,
            monitor_status = 'UNKNOWN',
            down_since = NULL
        WHERE telegram_id = ?
      `).run(telegramId);

      bot.sendMessage(
        chatId,
        `▶️ Website monitoring resumed successfully!\n\n🌐 Website: ${website.url}\n\nKhabri will check your website in the next scheduled cycle.`
      );
    } catch (error) {
      console.error("Resume website error:", error.message);

      bot.sendMessage(
        chatId,
        "Unable to resume monitoring right now. Please try again."
      );
    }
  });
}

module.exports = handleResume;