const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT fr.*, at.appointmentID, at.treatmentID
      FROM Financial_Record fr
      LEFT JOIN Appointment_Treatment at ON fr.apptTreatID = at.apptTreatID
      ORDER BY fr.billID
    `).all();
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", (req, res, next) => {
  try {
    const row = db.prepare("SELECT * FROM Financial_Record WHERE billID=?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { next(err); }
});

router.post("/", (req, res, next) => {
  try {
    const { billID, apptTreatID, amount, status } = req.body;
    db.prepare("INSERT INTO Financial_Record(billID, apptTreatID, amount, status) VALUES (?,?,?,?)")
      .run(billID, apptTreatID, amount, status);
    res.status(201).json({ ok: true, billID });
  } catch (err) { next(err); }
});

router.put("/:id", (req, res, next) => {
  try {
    const { apptTreatID, amount, status } = req.body;
    const info = db.prepare("UPDATE Financial_Record SET apptTreatID=?, amount=?, status=? WHERE billID=?")
      .run(apptTreatID, amount, status, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id", (req, res, next) => {
  try {
    const info = db.prepare("DELETE FROM Financial_Record WHERE billID=?").run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
