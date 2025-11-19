const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM Employee ORDER BY empID").all();
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", (req, res, next) => {
  try {
    const row = db.prepare("SELECT * FROM Employee WHERE empID = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json(row);
  } catch (err) { next(err); }
});

router.post("/", (req, res, next) => {
  try {
    const { empID, efirst_name, elast_name, ephone_num, eemail } = req.body;
    db.prepare(`
      INSERT INTO Employee(empID, efirst_name, elast_name, ephone_num, eemail)
      VALUES (?,?,?,?,?)
    `).run(empID, efirst_name, elast_name, ephone_num, eemail);
    res.status(201).json({ ok: true, empID });
  } catch (err) { next(err); }
});

router.put("/:id", (req, res, next) => {
  try {
    const { efirst_name, elast_name, ephone_num, eemail } = req.body;
    const info = db.prepare(`
      UPDATE Employee SET efirst_name=?, elast_name=?, ephone_num=?, eemail=?
      WHERE empID=?
    `).run(efirst_name, elast_name, ephone_num, eemail, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.delete("/:id", (req, res, next) => {
  try {
    const info = db.prepare("DELETE FROM Employee WHERE empID = ?").run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
