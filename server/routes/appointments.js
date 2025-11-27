const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT a.*, p.pfirst_name, p.plast_name
      FROM Appointment a
      LEFT JOIN Patient p ON a.patientID = p.patientID
      ORDER BY a.appointment_date DESC
    `
      )
      .all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const row = db.prepare('SELECT * FROM Appointment WHERE appointmentID = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Appointment not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const { appointmentID, patientID, appointment_date, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO Appointment(appointmentID, patientID, appointment_date, status)
      VALUES (?,?,?,?)
    `);
    stmt.run(appointmentID, patientID, appointment_date, status);
    res.status(201).json({ ok: true, appointmentID });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { patientID, appointment_date, status } = req.body;
    const info = db
      .prepare(
        `
      UPDATE Appointment SET patientID=?, appointment_date=?, status=?
      WHERE appointmentID=?
    `
      )
      .run(patientID, appointment_date, status, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const info = db.prepare('DELETE FROM Appointment WHERE appointmentID = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
