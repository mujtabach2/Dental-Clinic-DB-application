const Database = require('better-sqlite3');
const path = require('path');

// Use global db if available (set by Vercel serverless function)
// Otherwise, use local database
let db;
if (global.db) {
  db = global.db;
} else {
  const dbPath = path.join(__dirname, 'db', 'a9.db');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
}

module.exports = db;
