const express = require("express");
const db = require("../db");
const router = express.Router();

// 1. Patients who attended at least one and never missed
router.get("/attended_no_missed", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT p.patientID, p.pfirst_name || ' ' || p.plast_name AS patient_name
      FROM Patient p
      WHERE EXISTS (SELECT 1 FROM Appointment a WHERE a.patientID = p.patientID AND a.status='Attended')
      AND NOT EXISTS (SELECT 1 FROM Appointment a WHERE a.patientID = p.patientID AND a.status='Missed')
      ORDER BY patient_name
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

// 2. Patients with above-average appointment count
router.get("/above_avg_appointments", (req, res, next) => {
  try {
    const rows = db.prepare(`
      WITH counts AS (
        SELECT patientID, COUNT(*) AS c
        FROM Appointment
        GROUP BY patientID
      ), avg_c AS (SELECT AVG(c) AS avg_c FROM counts)
      SELECT p.patientID, p.pfirst_name || ' ' || p.plast_name AS patient_name, c.c AS total_appointments
      FROM Patient p JOIN counts c ON p.patientID = c.patientID
      JOIN avg_c a WHERE c.c > a.avg_c
      ORDER BY total_appointments DESC
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

// 3. Unassigned employees
router.get("/unassigned_employees", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT e.empID, e.efirst_name, e.elast_name, e.ephone_num, COUNT(s.work_date) AS scheduled_days
      FROM Employee e
      LEFT JOIN Secretary sec ON e.empID = sec.empID
      LEFT JOIN Dental_Staff ds ON e.empID = ds.empID
      LEFT JOIN Billing_Admin ba ON e.empID = ba.empID
      JOIN Schedule s ON e.empID = s.empID
      WHERE sec.empID IS NULL AND ds.empID IS NULL AND ba.empID IS NULL
      GROUP BY e.empID
      HAVING scheduled_days > 0
      ORDER BY scheduled_days DESC
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

// 4. Secretaries working on specific dates
router.get("/secretaries_working", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT DISTINCT e.empID, e.efirst_name || ' ' || e.elast_name AS full_name, e.eemail
      FROM Employee e
      JOIN Schedule sch ON e.empID = sch.empID
      JOIN Secretary sec ON e.empID = sec.empID
      WHERE sch.work_date IN ('2025-10-10','2024-01-17')
      ORDER BY e.empID
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

// 5. Top 3 earning treatments
router.get("/top3_treatments", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT t.treatmentName AS treatment, SUM(fr.amount) AS total_earnings
      FROM Treatment t
      JOIN Appointment_Treatment at ON t.treatmentID = at.treatmentID
      JOIN Financial_Record fr ON at.apptTreatID = fr.apptTreatID
      GROUP BY t.treatmentName
      ORDER BY total_earnings DESC
      LIMIT 3
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

// 6. Avg cost per treatment + counts
router.get("/avg_costs", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT t.treatmentName AS treatment, ROUND(AVG(fr.amount),2) AS avg_cost,
             SUM(fr.status = 'Pending') AS pending_count,
             SUM(fr.status = 'Overdue') AS overdue_count
      FROM Treatment t
      JOIN Appointment_Treatment at ON t.treatmentID = at.treatmentID
      JOIN Financial_Record fr ON at.apptTreatID = fr.apptTreatID
      GROUP BY t.treatmentName
      ORDER BY avg_cost DESC
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
