PRAGMA foreign_keys = ON;

-- Patient Table
INSERT INTO Patient VALUES
(1,'John','Doe','1985-06-15','123 Main St, Toronto','4165551234','john.doe@dentist.com','Allergic to penicillin'),
(2,'Jane','Smith','1990-11-02','456 Queen St, Toronto','4165555678','jane.smith@dentist.com','No known allergies'),
(3,'Ahmed','Khan','2000-03-21','789 King St, Toronto','4165559876','ahmed.khan@dentist.com','History of gum disease'),
(4,'Sara','Ali','1995-08-10','321 Bloor St, Toronto','4165556543','sara.ali@dentist.com','Braces'),
(5,'Liam','Brown','2002-12-05','654 Yonge St, Toronto','4165554321','liam.brown@dentist.com','Sensitive teeth');

-- Appointment Table
INSERT INTO Appointment VALUES
(1,1,'2025-10-10','Attended'),
(2,2,'2025-10-12','Upcoming'),
(3,3,'2025-10-11','Missed'),
(4,4,'2025-10-15','Upcoming'),
(5,5,'2025-10-14','Attended'),
(6,1,'2025-10-20','Upcoming'),
(7,1,'2025-11-01','Upcoming');

-- Employee Table
-- Note: Passwords are set to empID by default (e.g., employee 1 has password "1")
-- Run the migrate-passwords script after populating to hash all passwords
-- Admin user: empID 999, password "999"
INSERT INTO Employee VALUES
(1,'Sarah','Johnson','4165550101','sarah.johnson@dentalclinic.com','1'),
(2,'Michael','Chen','4165550102','michael.chen@dentalclinic.com','2'),
(3,'Emily','Rodriguez','6475550103','emily.rodriguez@dentalclinic.com','3'),
(4,'David','Thompson','6475550104','david.thompson@dentalclinic.com','4'),
(5,'Lisa','Park','9055550105','lisa.park@dentalclinic.com','5'),
(6,'James','Wilson','9055550106','james.wilson@dentalclinic.com','6'),
(7,'Maria','Garcia','4375550107','maria.garcia@dentalclinic.com','7'),
(8,'Robert','Brown','4375550108','robert.brown@dentalclinic.com','8'),
(999,'Admin','User','0000000000','admin@dentalclinic.com','999');

-- Secretary Table
INSERT INTO Secretary VALUES
(1,1),
(2,2);

-- Dental Staff Table
INSERT INTO Dental_Staff VALUES
(1,3),
(2,4),
(3,5);

-- Billing Admin Table
INSERT INTO Billing_Admin VALUES
(1,6),
(2,7);

-- Part Time Table
INSERT INTO Part_Time VALUES
(22.50,1),
(24.00,2),
(28.75,5);

-- Full Time Table
INSERT INTO Full_Time VALUES
(65000,3),
(72000,4),
(58000,6),
(62000,7),
(68000,8);

-- Schedule Table
INSERT INTO Schedule VALUES
('2025-10-10',1),
('2025-10-10',2),
('2025-10-10',3),
('2025-10-10',4),
('2025-10-11',5),
('2025-10-11',6),
('2025-10-11',7),
('2025-10-11',1),
('2025-10-12',3),
('2025-10-12',4),
('2025-10-12',6),
('2025-10-12',8),
('2024-01-12',2),
('2024-01-17',1),
('2024-01-17',5),
('2024-01-17',7),
('2024-01-17',8);

-- Treatment Table
INSERT INTO Treatment VALUES
(1,'Teeth Cleaning',120.00),
(2,'Cavity Filling',200.00),
(3,'Root Canal',750.00),
(4,'Braces Adjustment',150.00),
(5,'Tooth Extraction',300.00);

-- Appointment_Treatment Table
INSERT INTO Appointment_Treatment VALUES
(1,1,1,1),
(2,2,2,1),
(3,3,3,1),
(4,4,4,1),
(5,5,5,1);

-- Financial Record Table
INSERT INTO Financial_Record VALUES
(1,1,120.00,'Paid'),
(2,2,200.00,'Pending'),
(3,3,750.00,'Overdue'),
(4,4,150.00,'Paid'),
(5,5,300.00,'Pending');
