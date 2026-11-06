
const db = require("./database");

function handleClear(bot) {
  // User sends /clear
  bot.onText(/\/clear$/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      "⚠️ Before clearing, please note:\n\n" +
        "• I can delete only messages sent by Khabri bot.\n" +
        "• Messages sent by you cannot be deleted by this command.\n" +
        "• Your registered website and monitoring data will remain safe.\n\n" +
        "Do you want to continue?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Yes, Clear Messages",
                callback_data: "clear_confirm",
              },
              {
                text: "❌ Cancel",
                callback_data: "clear_cancel",
              },
            ],
          ],
        },
      }
    );
  });

  // Handle confirmation buttons
  bot.on("callback_query", async (query) => {
    const action = query.data;
    const chatId = query.message?.chat.id;

    if (!["clear_confirm", "clear_cancel"].includes(action)) {
      return;
    }

    // Only allow the person who opened the private chat to confirm
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

    // Cancel action
    if (action === "clear_cancel") {
      await bot.editMessageText(
        "❌ Clear cancelled. No messages were deleted.",
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );
      return;
    }

    // Get all tracked bot messages for this chat
    const messages = db
      .prepare(
        "SELECT message_id FROM bot_messages WHERE chat_id = ?"
      )
      .all(String(chatId));

    let deletedCount = 0;
    let failedCount = 0;

    // Delete tracked messages
    for (const message of messages) {
      try {
        await bot.deleteMessage(chatId, message.message_id);
        deletedCount++;
      } catch (error) {
        failedCount++;
        console.error(
          `Could not delete message ${message.message_id}:`,
          error.message
        );
      }
    }

    // Remove tracking records after attempting deletion
    db.prepare(
      "DELETE FROM bot_messages WHERE chat_id = ?"
    ).run(String(chatId));

    // Send final confirmation
    let result =
      `✅ Chat cleanup completed!\n\n` +
      `🗑️ Messages deleted: ${deletedCount}`;

    if (failedCount > 0) {
      result +=
        `\n⚠️ Messages not deleted: ${failedCount}` +
        `\n(Some messages may be older than Telegram's deletion limit.)`;
    }

    result +=
      "\n\nYour website registration and monitoring data are safe.";

    await bot.sendMessage(chatId, result);
  });
}

module.exports = handleClear;
