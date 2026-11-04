
function handleStart(bot) {
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
  
      const welcomeMessage =
        "👋 Namaste! Welcome to Khabri.\n\n" +
        "Your personal website monitoring assistant.\n\n" +
        "I will help you keep an eye on your website and notify you whenever its status changes.\n\n" +
        "Type /help to explore what I can do.";
  
      bot.sendMessage(chatId, welcomeMessage);
    });
  }
  
  module.exports = handleStart;
  