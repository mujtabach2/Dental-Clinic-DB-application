const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const router = express.Router();

function runSqlFile(filename) {
  const full = path.join(__dirname, "..", "db", filename);
  const sql = fs.readFileSync(full, "utf8");
  return db.exec(sql);
}

router.post("/drop", (req, res, next) => {
  try {
    runSqlFile("drop_tables.sql");
    res.json({ ok: true, action: "dropped" });
  } catch (err) { next(err); }
});

router.post("/create", (req, res, next) => {
  try {
    runSqlFile("create_tables.sql");
    res.json({ ok: true, action: "created" });
  } catch (err) { next(err); }
});

router.post("/populate", (req, res, next) => {
  try {
    console.log("populate HIT");
    
    // Check if data already exists
    const existingPatients = db.prepare("SELECT COUNT(*) as count FROM Patient").get();
    
    if (existingPatients.count > 0) {
      console.log("Database already populateed, skipping...");
      return res.json({ ok: true, action: "already_populated", message: "Database already contains data" });
    }
    
    runSqlFile("populate_data.sql");
    console.log("populate COMPLETE"); 
    res.json({ ok: true, action: "populateed" });
  } catch (err) {
    console.error("populate ERROR:", err);
    next(err);
  }
});

module.exports = router;
