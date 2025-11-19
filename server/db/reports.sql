-- 1. Patients who attended but never missed
SELECT p.patientID, p.pfirst_name || ' ' || p.plast_name AS patient_name
FROM Patient p
WHERE EXISTS (
    SELECT 1 FROM Appointment a
    WHERE a.patientID = p.patientID AND a.status = 'Attended'
)
AND NOT EXISTS (
    SELECT 1 FROM Appointment a
    WHERE a.patientID = p.patientID AND a.status = 'Missed'
)
ORDER BY patient_name;

-- 2. Patients with above-average appointment count
WITH counts AS (
    SELECT patientID, COUNT(*) AS c
    FROM Appointment
    GROUP BY patientID
),
avg_c AS (
    SELECT AVG(c) AS avg_c FROM counts
)
SELECT p.patientID,
       p.pfirst_name || ' ' || p.plast_name AS patient_name,
       c.c AS total_appointments
FROM Patient p
JOIN counts c ON p.patientID = c.patientID
JOIN avg_c a
WHERE c.c > a.avg_c
ORDER BY total_appointments DESC;

-- 3. Unassigned employees + workday count
SELECT e.empID, e.efirst_name, e.elast_name, e.ephone_num,
       COUNT(s.work_date) AS scheduled_days
FROM Employee e
LEFT JOIN Secretary sec ON e.empID = sec.empID
LEFT JOIN Dental_Staff ds ON e.empID = ds.empID
LEFT JOIN Billing_Admin ba ON e.empID = ba.empID
JOIN Schedule s ON e.empID = s.empID
WHERE sec.empID IS NULL AND ds.empID IS NULL AND ba.empID IS NULL
GROUP BY e.empID
HAVING scheduled_days > 0
ORDER BY scheduled_days DESC;

-- 4. Secretaries working on specific days
SELECT DISTINCT e.empID,
       e.efirst_name || ' ' || e.elast_name AS full_name,
       e.eemail
FROM Employee e
JOIN Schedule sch ON e.empID = sch.empID
JOIN Secretary sec ON e.empID = sec.empID
WHERE sch.work_date IN ('2025-10-10','2024-01-17')
ORDER BY e.empID;

-- 5. Top 3 earning treatments
SELECT t.treatmentName AS treatment,
       SUM(fr.amount) AS total_earnings
FROM Treatment t
JOIN Appointment_Treatment at ON t.treatmentID = at.treatmentID
JOIN Financial_Record fr ON at.apptTreatID = fr.apptTreatID
GROUP BY t.treatmentName
ORDER BY total_earnings DESC
LIMIT 3;

-- 6. Average cost of each treatment type + bill status counts
SELECT t.treatmentName AS treatment,
       ROUND(AVG(fr.amount), 2) AS avg_cost,
       SUM(fr.status = 'Pending') AS pending_count,
       SUM(fr.status = 'Overdue') AS overdue_count
FROM Treatment t
JOIN Appointment_Treatment at ON t.treatmentID = at.treatmentID
JOIN Financial_Record fr ON at.apptTreatID = fr.apptTreatID
GROUP BY t.treatmentName
ORDER BY avg_cost DESC;
