const db = require("./database");
const checkWebsite = require("./websiteChecker");

function handleStatus(bot) {
  bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    try {
      const website = db
        .prepare("SELECT url FROM websites WHERE telegram_id = ?")
        .get(telegramId);

      if (!website) {
        return bot.sendMessage(
          chatId,
          "You haven't added any website yet.\n\nUse /add https://example.com to register your website."
        );
      }

      await bot.sendMessage(
        chatId,
        `🔍 Checking your website...\n\n🌐 ${website.url}`
      );

      const result = await checkWebsite(website.url);

      let statusMessage;

      if (result.status === "ONLINE") {
        statusMessage = "🟢 ONLINE";
      } else if (result.status === "HTTP_ERROR") {
        statusMessage = "🟠 HTTP ERROR";
      } else {
        statusMessage = "🔴 DOWN";
      }

      const responseMessage =
        `📊 Website Status Report\n\n` +
        `🌐 Website: ${website.url}\n` +
        `📡 Status: ${statusMessage}\n` +
        `🔢 HTTP Code: ${result.statusCode ?? "Unavailable"}\n` +
        `⚡ Response Time: ${result.responseTime} ms\n` +
        `🕒 Checked At: ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}`;

      await bot.sendMessage(chatId, responseMessage);
    } catch (error) {
      console.error("Status check error:", error.message);

      bot.sendMessage(
        chatId,
        "Unable to check your website right now. Please try again."
      );
    }
  });
}

module.exports = handleStatus;