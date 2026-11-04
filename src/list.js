const db = require("./database");

function handleList(bot) {
  bot.onText(/\/list/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    try {
      const websites = db
        .prepare("SELECT id, url, created_at FROM websites WHERE telegram_id = ?")
        .all(telegramId);

      if (websites.length === 0) {
        return bot.sendMessage(
          chatId,
          "You haven't added any website yet.\n\nUse /add https://example.com to register your website."
        );
      }

      const websiteList = websites
        .map((website, index) => {
          return (
            `${index + 1}. 🌐 ${website.url}\n` +
            `   Added: ${website.created_at}`
          );
        })
        .join("\n\n");

      bot.sendMessage(
        chatId,
        `📋 Your Registered Website\n\n${websiteList}`
      );
    } catch (error) {
      console.error("List websites error:", error.message);

      bot.sendMessage(
        chatId,
        "Unable to retrieve your websites right now. Please try again."
      );
    }
  });
}

module.exports = handleList;