const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM Patient ORDER BY patientID').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const row = db.prepare('SELECT * FROM Patient WHERE patientID = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Patient not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const { patientID, pfirst_name, plast_name, pDOB, paddress, pphone, pemail, medical_history } =
      req.body;
    const stmt = db.prepare(`
      INSERT INTO Patient(patientID, pfirst_name, plast_name, pDOB, paddress, pphone, pemail, medical_history)
      VALUES (?,?,?,?,?,?,?,?)
    `);
    stmt.run(patientID, pfirst_name, plast_name, pDOB, paddress, pphone, pemail, medical_history);
    res.status(201).json({ ok: true, patientID });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { pfirst_name, plast_name, pDOB, paddress, pphone, pemail, medical_history } = req.body;
    const info = db
      .prepare(
        `
      UPDATE Patient SET pfirst_name=?, plast_name=?, pDOB=?, paddress=?, pphone=?, pemail=?, medical_history=?
      WHERE patientID=?
    `
      )
      .run(pfirst_name, plast_name, pDOB, paddress, pphone, pemail, medical_history, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const info = db.prepare('DELETE FROM Patient WHERE patientID = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
