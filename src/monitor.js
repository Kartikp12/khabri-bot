
const cron = require("node-cron");
const db = require("./database");
const checkWebsite = require("./websiteChecker");

const FAILURE_THRESHOLD = 2;

function startMonitoring(bot) {
  console.log("Khabri automatic monitoring started.");

  cron.schedule("*/5 * * * *", async () => {
    console.log("Running scheduled website checks...");

    try {
      // Delete monitoring history older than 24 hours
      const cleanup = db.prepare(`
        DELETE FROM website_history
        WHERE checked_at < datetime('now', '-24 hours')
      `).run();

      if (cleanup.changes > 0) {
        console.log(
          `Database cleanup: ${cleanup.changes} old history records deleted.`
        );
      }
    } catch (error) {
      console.error("Database cleanup error:", error.message);
    }

    const websites = db
      .prepare("SELECT * FROM websites WHERE is_paused = 0")
      .all();

    for (const website of websites) {
      try {
        const result = await checkWebsite(website.url);

        // Check whether the website still exists
// It may have been removed while the check was running.
const stillRegistered = db
.prepare("SELECT id FROM websites WHERE id = ?")
.get(website.id);

if (!stillRegistered) {
console.log(`Skipping deleted website: ${website.url}`);
continue;
}

        const checkedAt = new Date().toISOString();

        db.prepare(`
          INSERT INTO website_history (
            website_id,
            status,
            status_code,
            response_time,
            checked_at
          )
          VALUES (?, ?, ?, ?, ?)
        `).run(
          website.id,
          result.status,
          result.statusCode ?? null,
          result.responseTime,
          checkedAt
        );

        console.log(
          `Checked ${website.url}: ${result.status} (${result.responseTime} ms)`
        );

        // Successful website response
        if (result.status === "ONLINE") {
          const wasDown = website.monitor_status === "DOWN";
          const previousDownSince = website.down_since;

          db.prepare(`
            UPDATE websites
            SET failure_count = 0,
                monitor_status = 'ONLINE',
                last_checked_at = ?,
                down_since = NULL
            WHERE id = ?
          `).run(checkedAt, website.id);

          // Send recovery alert only if previously DOWN
          if (wasDown) {
            const downtime = previousDownSince
              ? Date.now() - new Date(previousDownSince).getTime()
              : null;

            const downtimeMinutes = downtime !== null
              ? Math.max(0, Math.round(downtime / 60000))
              : null;

            const recoveryMessage =
              `🟢 WEBSITE BACK ONLINE!\n\n` +
              `🌐 Website: ${website.url}\n` +
              `📡 Status: ONLINE\n` +
              `🔢 HTTP Code: ${result.statusCode}\n` +
              `⚡ Response Time: ${result.responseTime} ms\n` +
              `⏱️ Downtime: ${downtimeMinutes !== null ? `${downtimeMinutes} minutes` : "Unavailable"}\n\n` +
              `Your website is responding again!`;

            await bot.sendMessage(
              website.telegram_id,
              recoveryMessage
            );

            console.log(`Recovery alert sent: ${website.url}`);
          }

          continue;
        }

        // Failed website response
        const newFailureCount = website.failure_count + 1;

        const shouldSendDownAlert =
          newFailureCount >= FAILURE_THRESHOLD &&
          website.monitor_status !== "DOWN";

        const downSince = shouldSendDownAlert
          ? checkedAt
          : website.down_since;

        db.prepare(`
          UPDATE websites
          SET failure_count = ?,
              monitor_status = ?,
              last_checked_at = ?,
              down_since = ?
          WHERE id = ?
        `).run(
          newFailureCount,
          shouldSendDownAlert ? "DOWN" : website.monitor_status,
          checkedAt,
          downSince,
          website.id
        );

        console.log(
          `Failure count for ${website.url}: ${newFailureCount}`
        );

        // Send alert after 2 consecutive failures
        if (shouldSendDownAlert) {
          const downMessage =
            `🔴 WEBSITE IS DOWN!\n\n` +
            `🌐 Website: ${website.url}\n` +
            `📡 Status: DOWN\n` +
            `❌ Consecutive Failures: ${newFailureCount}\n` +
            `🕒 Detected At: ${new Date(checkedAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}\n\n` +
            `Khabri will notify you when your website recovers.`;

          await bot.sendMessage(
            website.telegram_id,
            downMessage
          );

          console.log(`Down alert sent: ${website.url}`);
        }
      } catch (error) {
        console.error(
          `Monitoring error for ${website.url}:`,
          error.message
        );
      }
    }
  });
}

module.exports = startMonitoring;
