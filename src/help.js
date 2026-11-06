
function handleHelp(bot) {
    bot.onText(/^\/help(?:@\w+)?$/, (msg) => {
      const chatId = msg.chat.id;
  
      const helpMessage =
        "📌 Khabri - Help Center\n\n" +
        "Khabri helps you monitor your website and stay informed about its availability.\n\n" +
        "📋 GENERAL COMMANDS\n\n" +
        "/start - Start the bot\n" +
        "/help - View all available commands\n" +
        "/about - Learn more about Khabri\n" +
        "/clear - Clear messages sent by Khabri\n\n" +
        "🌐 WEBSITE MONITORING\n\n" +
        "/add <url> - Add a website to monitor\n" +
        "/list - View your registered website\n" +
        "/status - Check your website status instantly\n" +
        "/remove - Remove your registered website\n\n" +
        "⚙️ MONITORING CONTROLS\n\n" +
        "/pause - Pause automatic monitoring\n" +
        "/resume - Resume automatic monitoring\n\n" +
        "📊 REPORTS\n\n" +
        "/report - View your last 24 hours uptime report\n\n" +
        "⏱️ Monitoring Interval: Every 5 minutes\n" +
        "🔔 Alerts: Website downtime and recovery\n" +
        "🌐 Website Limit: One website per user\n\n" +
        "Stay alert. Stay informed. 🚀";
  
      bot.sendMessage(chatId, helpMessage);
    });
  }
  
  module.exports = handleHelp;
  