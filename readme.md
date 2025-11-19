
# Server-side documentation

installation
cd server
npm install

Starting server 
npm start

# endpoints

Patients
GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id

Appointments
GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id

Employees
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id

Treatments
GET    /api/treatments
POST   /api/treatments
PUT    /api/treatments/:id
DELETE /api/treatments/:id

Appointment_Treatment
GET    /api/appointment_treatments
POST   /api/appointment_treatments
PUT    /api/appointment_treatments/:id
DELETE /api/appointment_treatments/:id

Financial Records
GET    /api/financial_records
POST   /api/financial_records
PUT    /api/financial_records/:id
DELETE /api/financial_records/:id

Advanced Reports
GET /api/reports/attended_no_missed
GET /api/reports/above_avg_appointments
GET /api/reports/unassigned_employees
GET /api/reports/secretaries_working
GET /api/reports/top3_treatments
GET /api/reports/avg_costs


