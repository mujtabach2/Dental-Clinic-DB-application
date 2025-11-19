const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM Treatment ORDER BY treatmentID").all();
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", (req, res, next) => {
  try {
    const row = db.prepare("SELECT * FROM Treatment WHERE treatmentID = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Treatment not found" });
    res.json(row);
  } catch (err) { next(err); }
});

router.post("/", (req, res, next) => {
  try {
    const { treatmentID, treatmentName, cost } = req.body;
    db.prepare("INSERT INTO Treatment(treatmentID,treatmentName,cost) VALUES (?,?,?)")
      .run(treatmentID, treatmentName, cost);
    res.status(201).json({ ok: true, treatmentID });
  } catch (err) { next(err); }
});

router.put("/:id", (req, res, next) => {
  try {
    const { treatmentName, cost } = req.body;
    const info = db.prepare("UPDATE Treatment SET treatmentName=?, cost=? WHERE treatmentID=?")
      .run(treatmentName, cost, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Treatment not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id", (req, res, next) => {
  try {
    const info = db.prepare("DELETE FROM Treatment WHERE treatmentID=?").run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Treatment not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;

