
function handleAbout(bot) {
    bot.onText(/\/about/, (msg) => {
      const chatId = msg.chat.id;
  
      const aboutMessage =
        "🕵️ About Khabri\n\n" +
        "Khabri is a website monitoring Telegram bot.\n\n" +
        "Our mission is to help website owners stay informed about their website availability.\n\n" +
        "Khabri will monitor your website and notify you when something goes wrong or when it recovers.\n\n" +
        "🚀 More monitoring features coming soon!";
  
      bot.sendMessage(chatId, aboutMessage);
    });
  }
  
  module.exports = handleAbout;
  