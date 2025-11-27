const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const app = express();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dental-clinic-super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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

const dbPath =
  process.env.VERCEL || process.env.VERCEL_ENV
    ? path.join('/tmp', 'dental.db')
    : path.join(__dirname, './db/a9.db');

let db;
try {
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
} catch (err) {
  console.error('Database connection error:', err);
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
}
global.db = db;

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  next();
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = req.session.user;
    const hasRole = allowedRoles.some(role => user.roles.includes(role) || user.isAdmin);

    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

function getUserWithRoles(empID) {
  const user = db.prepare(`SELECT * FROM Employee WHERE empID = ?`).get(empID);
  if (!user) return null;

  const roles = [];

  if (db.prepare(`SELECT 1 FROM Secretary WHERE empID = ?`).get(empID)) roles.push('secretary');
  if (db.prepare(`SELECT 1 FROM Dental_Staff WHERE empID = ?`).get(empID))
    roles.push('dental_staff');
  if (db.prepare(`SELECT 1 FROM Billing_Admin WHERE empID = ?`).get(empID))
    roles.push('billing_admin');

  const isAdmin = empID === 999;

  return { ...user, roles, isAdmin };
}

app.post('/api/login', async (req, res) => {
  const { empID, password } = req.body;

  if (!empID || !password) {
    return res.status(400).json({ error: 'Employee ID and password are required' });
  }

  try {
    const empIDNum = parseInt(empID, 10);
    if (isNaN(empIDNum) || empIDNum <= 0) {
      return res.status(400).json({ error: 'Invalid Employee ID' });
    }

    const user = db
      .prepare(
        `
      SELECT empID, password, efirst_name, elast_name, ephone_num, eemail
      FROM Employee
      WHERE empID = ?
    `
      )
      .get(empIDNum);

    if (!user) {
      return res.status(401).json({ error: 'Invalid Employee ID or password' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid Employee ID or password' });
    }

    const fullUser = getUserWithRoles(empIDNum);

    req.session.user = fullUser;

    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session error' });
      }

      const { password: _, ...safeUser } = fullUser;
      res.json({ message: 'Login successful', user: safeUser });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error – please try again later' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { password: _, ...safeUser } = req.session.user;
  res.json(safeUser);
});

app.use('/api', (req, res, next) => {
  if (req.path === '/login' || req.path.startsWith('/health')) {
    return next();
  }
  requireLogin(req, res, next);
});

const adminOnly = requireRole(['admin']);
const secretaryOnly = requireRole(['secretary']);
const dentalOnly = requireRole(['dental_staff']);
const billingOnly = requireRole(['billing_admin']);

const secretaryOrAdmin = requireRole(['secretary', 'admin']);
const dentalOrAdmin = requireRole(['dental_staff', 'admin']);
const billingOrAdmin = requireRole(['billing_admin', 'admin']);

const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');
const employeesRouter = require('./routes/employees');
const treatmentsRouter = require('./routes/treatments');
const apptTreatRouter = require('./routes/appointment_treatments');
const financialRouter = require('./routes/financial_records');
const reportsRouter = require('./routes/reports');
const adminRouter = require('./routes/admin');

app.use('/api/patients', patientsRouter);
app.use('/api/appointments', secretaryOrAdmin, appointmentsRouter);
app.use('/api/employees', requireLogin, employeesRouter);
app.use('/api/treatments', requireLogin, treatmentsRouter);
app.use('/api/appointment_treatments', secretaryOrAdmin, apptTreatRouter);
app.use('/api/financial_records', billingOrAdmin, financialRouter);
app.use('/api/reports', requireLogin, reportsRouter);
app.use(
  '/api/admin',
  (req, res, next) => {
    if (!req.session.user || req.session.user.empID !== 999) {
      return res.status(403).json({ error: 'Only Admin (ID: 999) can access this' });
    }
    next();
  },
  adminRouter
);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server Error' });
});

module.exports = app;
