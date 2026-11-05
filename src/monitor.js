const cron = require("node-cron");
const db = require("./database");
const checkWebsite = require("./websiteChecker");

const FAILURE_THRESHOLD = 2;

function startMonitoring(bot) {
  console.log("Khabri automatic monitoring started.");

  cron.schedule("*/5 * * * *", async () => {
    console.log("Running scheduled website checks...");

    const websites = db
      .prepare("SELECT id, telegram_id, url FROM websites")
      .all();

    for (const website of websites) {
      try {
        const result = await checkWebsite(website.url);

        console.log(
          `Checked ${website.url}: ${result.status} (${result.responseTime} ms)`
        );

        // Monitoring state will be handled in the next step.
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