const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

// Initialize database connection
// For Vercel, we'll use /tmp directory which is writable
const dbPath = process.env.VERCEL || process.env.VERCEL_ENV
  ? path.join("/tmp", "dental.db")
  : path.join(__dirname, "../server/db/a9.db");

let db;
try {
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
} catch (err) {
  console.error("Database connection error:", err);
  // Fallback: try to create database if it doesn't exist
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  
  // Initialize tables if they don't exist
  const fs = require("fs");
  const createTablesPath = path.join(__dirname, "../server/db/create_tables.sql");
  if (fs.existsSync(createTablesPath)) {
    const sql = fs.readFileSync(createTablesPath, "utf8");
    try {
      db.exec(sql);
    } catch (e) {
      console.error("Error creating tables:", e);
    }
  }
}

// Export db for use in routes
global.db = db;

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const patientsRouter = require("../server/routes/patients");
const appointmentsRouter = require("../server/routes/appointments");
const employeesRouter = require("../server/routes/employees");
const treatmentsRouter = require("../server/routes/treatments");
const apptTreatRouter = require("../server/routes/appointment_treatments");
const financialRouter = require("../server/routes/financial_records");
const reportsRouter = require("../server/routes/reports");
const adminRouter = require("../server/routes/admin");

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/patients", patientsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/treatments", treatmentsRouter);
app.use("/api/appointment_treatments", apptTreatRouter);
app.use("/api/financial_records", financialRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Export for Vercel
module.exports = app;

