const express = require("express");
const cors = require("cors");
const bodyParser = require("express").json;

const db = require("./db"); 
const patientsRouter = require("./routes/patients");
const appointmentsRouter = require("./routes/appointments");
const employeesRouter = require("./routes/employees");
const treatmentsRouter = require("./routes/treatments");
const apptTreatRouter = require("./routes/appointment_treatments");
const financialRouter = require("./routes/financial_records");
const reportsRouter = require("./routes/reports");
const adminRouter = require("./routes/admin");

const app = express();
app.use(cors());
app.use(bodyParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/patients", patientsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/treatments", treatmentsRouter);
app.use("/api/appointment_treatments", apptTreatRouter);
app.use("/api/financial_records", financialRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);


app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
