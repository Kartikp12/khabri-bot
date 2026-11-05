const db = require("./database");

function handleRemove(bot) {
  bot.onText(/\/remove/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    try {
      const result = db
        .prepare("DELETE FROM websites WHERE telegram_id = ?")
        .run(telegramId);

      if (result.changes === 0) {
        return bot.sendMessage(
          chatId,
          "You don't have any registered website to remove."
        );
      }

      bot.sendMessage(
        chatId,
        "✅ Your registered website has been removed successfully.\n\nYou can add a new website anytime using /add."
      );
    } catch (error) {
      console.error("Remove website error:", error.message);

      bot.sendMessage(
        chatId,
        "Unable to remove your website right now. Please try again."
      );
    }
  });
}

module.exports = handleRemove;