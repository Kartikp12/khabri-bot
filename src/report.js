const db = require("./database");

function handleReport(bot) {
  bot.onText(/\/report/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);

    const website = db
      .prepare("SELECT * FROM websites WHERE telegram_id = ?")
      .get(telegramId);

    if (!website) {
      return bot.sendMessage(
        chatId,
        "You haven't added any website yet.\n\nUse /add to register your website."
      );
    }

    const report = db.prepare(`
      SELECT
        COUNT(*) AS total_checks,
        SUM(CASE WHEN status = 'ONLINE' THEN 1 ELSE 0 END) AS successful_checks,
        SUM(CASE WHEN status != 'ONLINE' THEN 1 ELSE 0 END) AS failed_checks,
        AVG(CASE WHEN status = 'ONLINE' THEN response_time END) AS avg_response_time
      FROM website_history
      WHERE website_id = ?
      AND checked_at >= datetime('now', '-24 hours')
    `).get(website.id);

    const totalChecks = report.total_checks || 0;
    const successfulChecks = report.successful_checks || 0;
    const failedChecks = report.failed_checks || 0;

    const uptime =
      totalChecks > 0
        ? ((successfulChecks / totalChecks) * 100).toFixed(2)
        : "0.00";

    const avgResponseTime =
      report.avg_response_time !== null
        ? `${Math.round(report.avg_response_time)} ms`
        : "N/A";

    const reportMessage =
      `📊 Khabri - Website Report\n\n` +
      `🌐 Website: ${website.url}\n` +
      `📡 Current Status: ${website.monitor_status}\n\n` +
      `📅 Report Period: Last 24 Hours\n\n` +
      `📈 Uptime: ${uptime}%\n` +
      `🔍 Total Checks: ${totalChecks}\n` +
      `🟢 Successful Checks: ${successfulChecks}\n` +
      `🔴 Failed Checks: ${failedChecks}\n` +
      `⚡ Average Response Time: ${avgResponseTime}\n\n` +
      `ℹ️ Uptime is calculated from recorded monitoring checks.`;

    bot.sendMessage(chatId, reportMessage);
  });
}

module.exports = handleReport;