
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "khabri.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add monitoring columns without deleting existing data
const columns = db
  .prepare("PRAGMA table_info(websites)")
  .all()
  .map((column) => column.name);

if (!columns.includes("failure_count")) {
  db.exec(`
    ALTER TABLE websites
    ADD COLUMN failure_count INTEGER NOT NULL DEFAULT 0
  `);
}

if (!columns.includes("monitor_status")) {
  db.exec(`
    ALTER TABLE websites
    ADD COLUMN monitor_status TEXT NOT NULL DEFAULT 'UNKNOWN'
  `);
}

if (!columns.includes("last_checked_at")) {
  db.exec(`
    ALTER TABLE websites
    ADD COLUMN last_checked_at DATETIME
  `);
}

if (!columns.includes("down_since")) {
  db.exec(`
    ALTER TABLE websites
    ADD COLUMN down_since DATETIME
  `);
}

if (!columns.includes("is_paused")) {
    db.exec(`
      ALTER TABLE websites
      ADD COLUMN is_paused INTEGER NOT NULL DEFAULT 0
    `);
  }



console.log("Khabri database connected successfully.");
console.log("Monitoring columns verified successfully.");

module.exports = db;
