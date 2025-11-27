PRAGMA foreign_keys = ON;

CREATE TABLE Patient (
    patientID INTEGER PRIMARY KEY,
    pfirst_name TEXT NOT NULL,
    plast_name TEXT NOT NULL,
    pDOB TEXT NOT NULL,
    paddress TEXT,
    pphone TEXT,
    pemail TEXT,
    medical_history TEXT
);

CREATE TABLE Appointment (
    appointmentID INTEGER PRIMARY KEY,
    patientID INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    status TEXT CHECK (status IN ('Upcoming','Missed','Attended')),
    FOREIGN KEY (patientID) REFERENCES Patient(patientID)
);

CREATE TABLE Treatment (
    treatmentID INTEGER PRIMARY KEY,
    treatmentName TEXT NOT NULL,
    cost REAL NOT NULL
);

CREATE TABLE Appointment_Treatment (
    apptTreatID INTEGER PRIMARY KEY,
    appointmentID INTEGER NOT NULL,
    treatmentID INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (appointmentID) REFERENCES Appointment(appointmentID),
    FOREIGN KEY (treatmentID) REFERENCES Treatment(treatmentID)
);

CREATE TABLE Financial_Record (
    billID INTEGER PRIMARY KEY,
    apptTreatID INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT CHECK (status IN ('Pending','Paid','Overdue')),
    FOREIGN KEY (apptTreatID) REFERENCES Appointment_Treatment(apptTreatID)
);

CREATE TABLE Employee (
    empID INTEGER PRIMARY KEY,
    efirst_name TEXT NOT NULL,
    elast_name TEXT NOT NULL,
    ephone_num TEXT NOT NULL,
    eemail TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE Secretary (
    sec_id INTEGER PRIMARY KEY,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);

CREATE TABLE Dental_Staff (
    dental_id INTEGER PRIMARY KEY,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);

CREATE TABLE Billing_Admin (
    billing_admin_id INTEGER PRIMARY KEY,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);

CREATE TABLE Part_Time (
    hourly_wage REAL NOT NULL,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);

CREATE TABLE Full_Time (
    salary REAL NOT NULL,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);

CREATE TABLE Schedule (
    work_date TEXT NOT NULL,
    empID INTEGER NOT NULL,
    FOREIGN KEY (empID) REFERENCES Employee(empID)
);
