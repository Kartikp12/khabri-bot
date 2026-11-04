
function handleHelp(bot) {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const helpMessage =
      "📌 Khabri - Help Center\n\n" +
      "Here are the commands you can use:\n\n" +
      "/start - Start the bot\n" +
      "/help - View available commands\n" +
      "/about - Learn about Khabri\n\n" +
      "🌐 Website monitoring features are coming soon!\n\n" +
      "Stay alert. Stay informed.";

    bot.sendMessage(chatId, helpMessage);
  });
}

module.exports = handleHelp;
