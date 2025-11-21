# Server-Side Documentation

This backend provides a complete standalone database-driven application using **Node.js**, **Express.js**, and **SQLite** (via `better-sqlite3`). It includes:

- Automated database creation  
- Automated seeding  
- CRUD operations for all core entities  
- Advanced reporting queries 
- Server-side validation
- A clean REST API structure

The server runs independently and includes all schema definitions and population data.

---

## Requirements

Ensure the following are installed:

- **Node.js 18+**
- **npm**

---

## Installation

```bash
cd server
npm install

```

Start the server

```bash
npm start
```

## API endpoints
---

> **Note:** The database contains additional internal tables created during initialization.  
> Only the tables listed below are exposed through REST API endpoints.

Patients

```text
GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

Appointments

```text
GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

Employees

```text
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

Treatments

```text
GET    /api/treatments
POST   /api/treatments
PUT    /api/treatments/:id
DELETE /api/treatments/:id
```

Appointment_Treatment

```text
GET    /api/appointment_treatments
POST   /api/appointment_treatments
PUT    /api/appointment_treatments/:id
DELETE /api/appointment_treatments/:id
```

Financial Records

```text
GET    /api/financial_records
POST   /api/financial_records
PUT    /api/financial_records/:id
DELETE /api/financial_records/:id
```

Advanced Reports

```text
GET /api/reports/attended_no_missed         
GET /api/reports/above_avg_appointments     
GET /api/reports/unassigned_employees    
GET /api/reports/secretaries_working  
GET /api/reports/top3_treatments            
GET /api/reports/avg_costs             
```
