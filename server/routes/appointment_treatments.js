const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT at.*, a.appointment_date, t.treatmentName
      FROM Appointment_Treatment at
      LEFT JOIN Appointment a ON at.appointmentID = a.appointmentID
      LEFT JOIN Treatment t ON at.treatmentID = t.treatmentID
      ORDER BY at.apptTreatID
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
    const row = db
      .prepare('SELECT * FROM Appointment_Treatment WHERE apptTreatID=?')
      .get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const { apptTreatID, appointmentID, treatmentID, quantity } = req.body;
    db.prepare(
      'INSERT INTO Appointment_Treatment(apptTreatID,appointmentID,treatmentID,quantity) VALUES (?,?,?,?)'
    ).run(apptTreatID, appointmentID, treatmentID, quantity || 1);
    res.status(201).json({ ok: true, apptTreatID });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { appointmentID, treatmentID, quantity } = req.body;
    const info = db
      .prepare(
        'UPDATE Appointment_Treatment SET appointmentID=?, treatmentID=?, quantity=? WHERE apptTreatID=?'
      )
      .run(appointmentID, treatmentID, quantity, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const info = db
      .prepare('DELETE FROM Appointment_Treatment WHERE apptTreatID=?')
      .run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
