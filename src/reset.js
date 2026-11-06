
const db = require("./database");

function handleReset(bot) {
  // User sends /reset
  bot.onText(/^\/reset(?:@\w+)?$/, async (msg) => {
    const chatId = msg.chat.id;

    // Reset is supported only in private chats
    if (msg.chat.type !== "private") {
      await bot.sendMessage(
        chatId,
        "Please use /reset in your private chat with Khabri."
      );
      return;
    }

    await bot.sendMessage(
      chatId,
      "⚠️ WARNING: PERMANENT ACTION\n\n" +
        "Are you sure you want to reset your Khabri account?\n\n" +
        "The following data will be permanently deleted:\n\n" +
        "🌐 Registered website\n" +
        "📊 Monitoring history\n" +
        "📡 Website status and failure records\n" +
        "⏸️ Pause/resume settings\n\n" +
        "⚠️ This action cannot be undone!\n\n" +
        "Do you really want to continue?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🗑️ Yes, Reset Everything",
                callback_data: "reset_confirm",
              },
            ],
            [
              {
                text: "❌ Cancel",
                callback_data: "reset_cancel",
              },
            ],
          ],
        },
      }
    );
  });

  // Handle reset confirmation buttons
  bot.on("callback_query", async (query) => {
    const action = query.data;

    if (!["reset_confirm", "reset_cancel"].includes(action)) {
      return;
    }

    const chatId = query.message?.chat.id;

    // Only allow the owner of a private chat to confirm
    if (
      !chatId ||
      query.message.chat.type !== "private" ||
      String(query.from.id) !== String(chatId)
    ) {
      await bot.answerCallbackQuery(query.id, {
        text: "This action is not available here.",
        show_alert: true,
      });
      return;
    }

    await bot.answerCallbackQuery(query.id);

    // Cancel reset
    if (action === "reset_cancel") {
      await bot.editMessageText(
        "❌ Reset cancelled.\n\nYour Khabri data is safe.",
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );
      return;
    }

    try {
      // Delete only this user's data in one transaction
      const resetUser = db.transaction((telegramId) => {
        const website = db
          .prepare(
            "SELECT id FROM websites WHERE telegram_id = ?"
          )
          .get(String(telegramId));

        if (website) {
          db.prepare(
            "DELETE FROM website_history WHERE website_id = ?"
          ).run(website.id);

          db.prepare(
            "DELETE FROM websites WHERE id = ?"
          ).run(website.id);
        }

        // Clear this chat's message tracking records
        db.prepare(
          "DELETE FROM bot_messages WHERE chat_id = ?"
        ).run(String(chatId));
      });

      resetUser(query.from.id);

      await bot.editMessageText(
        "✅ Your Khabri account has been reset successfully.\n\n" +
          "Your registered website and monitoring history have been deleted.\n\n" +
          "You can register a new website anytime using /add.",
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );

      console.log(`Khabri account reset for user: ${query.from.id}`);
    } catch (error) {
      console.error("Account reset error:", error.message);

      await bot.sendMessage(
        chatId,
        "❌ Something went wrong while resetting your account. Please try again."
      );
    }
  });
}

module.exports = handleReset;
