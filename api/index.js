const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const app = express();

// Session middleware (critical for login state)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dental-clinic-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Disable for demo - set true in production with HTTPS
    httpOnly: true, // Prevent XSS attacks
    sameSite: 'lax', // Help with CORS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation helper
function validateInput(input, type = 'string') {
  if (input === null || input === undefined) return false;
  
  if (type === 'string') {
    return typeof input === 'string' && input.trim().length > 0 && input.length <= 255;
  } else if (type === 'integer') {
    const num = parseInt(input, 10);
    return !isNaN(num) && num > 0;
  } else if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof input === 'string' && emailRegex.test(input);
  }
  return false;
}

// Database setup (same as before)
const dbPath = process.env.VERCEL || process.env.VERCEL_ENV
  ? path.join("/tmp", "dental.db")
  : path.join(__dirname, "../server/db/a9.db");

let db;
try {
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
} catch (err) {
  console.error("Database connection error:", err);
  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");
}
global.db = db;

// Auto-initialize database if tables don't exist
function initializeDatabaseIfNeeded() {
  try {
    // Check if Employee table exists
    const tableCheck = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='Employee'
    `).get();
    
    if (!tableCheck) {
      console.log("Database tables not found. Initializing...");
      const createTablesSQL = fs.readFileSync(
        path.join(__dirname, "../server/db/create_tables.sql"),
        "utf8"
      );
      db.exec(createTablesSQL);
      console.log("Tables created successfully");
      
      // Populate with initial data
      try {
        const populateSQL = fs.readFileSync(
          path.join(__dirname, "../server/db/populate_data.sql"),
          "utf8"
        );
        db.exec(populateSQL);
        console.log("Initial data populated successfully");
      } catch (populateErr) {
        console.error("Error populating data:", populateErr);
        // Continue even if populate fails
      }
    }
  } catch (err) {
    console.error("Database initialization error:", err);
    // Don't throw - let the app continue, tables will be created on first admin action
  }
}

// Initialize on startup
initializeDatabaseIfNeeded();

// ====== AUTH MIDDLEWARE ======
function requireLogin(req, res, next) {
  console.log("Auth check:", req.path, req.sessionID, req.session.user ? "authenticated" : "not authenticated");
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }
  next();
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = req.session.user;
    const hasRole = allowedRoles.some(role => 
      user.roles.includes(role) || user.isAdmin
    );

    if (!hasRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}

// Helper: Get full user with roles
function getUserWithRoles(empID) {
  const user = db.prepare(`SELECT * FROM Employee WHERE empID = ?`).get(empID);
  if (!user) return null;

  const roles = [];

  if (db.prepare(`SELECT 1 FROM Secretary WHERE empID = ?`).get(empID)) roles.push('secretary');
  if (db.prepare(`SELECT 1 FROM Dental_Staff WHERE empID = ?`).get(empID)) roles.push('dental_staff');
  if (db.prepare(`SELECT 1 FROM Billing_Admin WHERE empID = ?`).get(empID)) roles.push('billing_admin');

  const isAdmin = empID === 999;

  return { ...user, roles, isAdmin };
}

// ====== LOGIN ROUTE ======

app.post("/api/login", async (req, res) => {
  const { empID, password } = req.body;

  // Simple validation
  if (!empID || !password) {
    return res.status(400).json({ error: "Employee ID and password are required" });
  }

  try {
    // Convert to integer
    const empIDNum = parseInt(empID, 10);
    if (isNaN(empIDNum) || empIDNum <= 0) {
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Ensure database is initialized (fallback check)
    try {
      db.prepare("SELECT 1 FROM Employee LIMIT 1").get();
    } catch (tableErr) {
      if (tableErr.code === 'SQLITE_ERROR' && tableErr.message.includes('no such table')) {
        console.log("Tables missing during login, initializing...");
        initializeDatabaseIfNeeded();
      } else {
        throw tableErr;
      }
    }

    // Get user from database
    const user = db.prepare(`
      SELECT empID, password, efirst_name, elast_name, ephone_num, eemail
      FROM Employee 
      WHERE empID = ?
    `).get(empIDNum);

    if (!user) {
      return res.status(401).json({ error: "Invalid Employee ID or password" });
    }

    // Simple plain text password check (for demo)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid Employee ID or password" });
    }

    // Build roles
    const fullUser = getUserWithRoles(empIDNum);

    // Save to session
    req.session.user = fullUser;
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Session error" });
      }
      
      // Send safe user object (no password)
      const { password: _, ...safeUser } = fullUser;
      res.json({ message: "Login successful", user: safeUser });
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error – please try again later" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

app.get("/api/me", (req, res) => {
  console.log("Session check:", req.sessionID, req.session.user ? "has user" : "no user");
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const { password: _, ...safeUser } = req.session.user;
  res.json(safeUser);
});

// ====== PROTECTED ROUTES ======
// Apply login requirement to all API routes except login/health
app.use("/api", (req, res, next) => {
  if (req.path === '/login' || req.path.startsWith('/health')) {
    return next();
  }
  requireLogin(req, res, next);
});

// Role-based route protection
const adminOnly = requireRole(['admin']);
const secretaryOnly = requireRole(['secretary']);
const dentalOnly = requireRole(['dental_staff']);
const billingOnly = requireRole(['billing_admin']);

// Or combine roles
const secretaryOrAdmin = requireRole(['secretary', 'admin']);
const dentalOrAdmin = requireRole(['dental_staff', 'admin']);
const billingOrAdmin = requireRole(['billing_admin', 'admin']);

// Import routes (you already have these)
const patientsRouter = require("../server/routes/patients");
const appointmentsRouter = require("../server/routes/appointments");
const employeesRouter = require("../server/routes/employees");
const treatmentsRouter = require("../server/routes/treatments");
const apptTreatRouter = require("../server/routes/appointment_treatments");
const financialRouter = require("../server/routes/financial_records");
const reportsRouter = require("../server/routes/reports");
const adminRouter = require("../server/routes/admin");

// Apply role restrictions
app.use("/api/patients", patientsRouter); // Everyone can see patients
app.use("/api/appointments", secretaryOrAdmin, appointmentsRouter);
app.use("/api/employees", requireLogin, employeesRouter); // Only logged-in
app.use("/api/treatments", requireLogin, treatmentsRouter);
app.use("/api/appointment_treatments", secretaryOrAdmin, apptTreatRouter);
app.use("/api/financial_records", billingOrAdmin, financialRouter);
app.use("/api/reports", requireLogin, reportsRouter); // Reports visible to all logged in
app.use("/api/admin", (req, res, next) => {
  if (!req.session.user || req.session.user.empID !== 999) {
    return res.status(403).json({ error: "Only Admin (ID: 999) can access this" });
  }
  next();
}, adminRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Server Error" });
});

module.exports = app;