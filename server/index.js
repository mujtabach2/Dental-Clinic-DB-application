const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");


const dbPath = process.env.VERCEL || process.env.VERCEL_ENV
  ? path.join("/tmp", "dental.db")
  : path.join(__dirname, "../server/db/a9.db");

let db;
try {
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
  

  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Patient'").get();
  

  if (!tableCheck) {
    console.log("Tables not found, initializing database...");
    const fs = require("fs");
    const createTablesPath = path.join(__dirname, "../server/db/create_tables.sql");
    if (fs.existsSync(createTablesPath)) {
      const sql = fs.readFileSync(createTablesPath, "utf8");
      try {
        db.exec(sql);
        console.log("Database tables created successfully");
      } catch (e) {
        console.error("Error creating tables:", e);
      }
    }
  }
} catch (err) {
  console.error("Database connection error:", err);
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
}

global.db = db;

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check endpoint (should come before other routes)
app.get("/api/health", (req, res) => {
  try {
    // Test database connection
    const result = db.prepare("SELECT 1 as test").get();
    res.json({ status: "ok", database: "connected", test: result });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

try {
  const patientsRouter = require("../server/routes/patients");
  const appointmentsRouter = require("../server/routes/appointments");
  const employeesRouter = require("../server/routes/employees");
  const treatmentsRouter = require("../server/routes/treatments");
  const apptTreatRouter = require("../server/routes/appointment_treatments");
  const financialRouter = require("../server/routes/financial_records");
  const reportsRouter = require("../server/routes/reports");
  const adminRouter = require("../server/routes/admin");

  app.use("/api/patients", patientsRouter);
  app.use("/api/appointments", appointmentsRouter);
  app.use("/api/employees", employeesRouter);
  app.use("/api/treatments", treatmentsRouter);
  app.use("/api/appointment_treatments", apptTreatRouter);
  app.use("/api/financial_records", financialRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/admin", adminRouter);
} catch (err) {
  console.error("Error loading routes:", err);
}

app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "API endpoint not found", 
    path: req.path,
    method: req.method 
  });
});
app.use((err, req, res, next) => {
  console.error("Error:", err && err.stack ? err.stack : err);
  
  if (req.path.startsWith('/api/')) {
    return res.status(err.status || 500).json({ 
      error: err.message || "Internal Server Error",
      path: req.path,
      method: req.method
    });
  }

  res.status(err.status || 500).json({ 
    error: err.message || "Internal Server Error" 
  });
});

module.exports = app;