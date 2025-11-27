# 🦷 Dental Clinic Management System

A comprehensive, full-stack web application for managing dental clinic operations including patient records, appointments, staff management, treatments, and financial tracking.

## ✨ Features

- **Patient Management** - Complete CRUD operations for patient records with medical history
- **Appointment Scheduling** - Book, track, and manage patient appointments
- **Staff Management** - Manage employees, dentists, secretaries, and billing admins
- **Treatment Catalog** - Define and price dental treatments
- **Service Records** - Link treatments to appointments with quantity tracking
- **Financial Tracking** - Monitor billing, payments, and outstanding balances
- **Advanced Reports**
  - Generate analytical insights:
  - Patients who never missed appointments
  - Above-average appointment frequency
  - Unassigned staff members
  - Secretary schedules
  - Top revenue-generating treatments
  - Average treatment costs by payment status
- **Database Administration** - Initialize, populate, and reset database with one click

## 🚀 Live Demo

**Deployed on Vercel**: https://dental-clinic-db-application.vercel.app/

## 🏗️ Tech Stack

### Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **Fetch API** 

### Backend
- **Node.js**
- **Express.js** 
- **better-sqlite3**
- **CORS** 

### Deployment
- **Vercel** - Serverless deployment platform
- **Serverless Functions** - API endpoints as serverless functions

## 📖 Usage Guide

### 🔐 Getting Started - Login

The application uses a simple login system with role-based access control.

**Demo Credentials:**
- **Admin**: Employee ID `999` / Password `999` (Full access to all features)
- **Secretary**: Employee ID `1` / Password `1` (Can manage appointments and services)
- **Dental Staff**: Employee ID `3` / Password `3` (Access to dental-related features)
- **Billing Admin**: Employee ID `6` / Password `6` (Access to financial records)

**Note:** For demo purposes, passwords are the same as Employee IDs.

### 🚀 First Time Setup

On first deployment, the database is automatically initialized. However, if you need to manually set up:

1. **Login** with Admin credentials (999 / 999)
2. Navigate to the **"Admin"** tab
3. Click **"Create Tables"** to initialize the database schema
4. Click **"Populate Data"** to add sample data including:
   - 5 sample patients
   - 7 appointments
   - 8 employees (with various roles)
   - 5 treatments
   - Financial records

### 👥 Managing Patients

**Access:** Available to all logged-in users

1. Click the **"Patients"** tab in the navigation
2. Click **"+ Add New Patient"** button
3. Fill in the patient form:
   - **Patient ID**: Unique identifier (required)
   - **First Name & Last Name**: Patient's full name (required)
   - **Date of Birth**: Patient's birth date (required)
   - **Address**: Patient's address (required)
   - **Phone**: Contact number (required)
   - **Email**: Email address (required)
   - **Medical History**: Any relevant medical information (optional)
4. Click **"Save Patient"** to create the record

**Editing/Deleting:**
- Click the **"Edit"** button next to any patient to modify their information
- Click the **"Delete"** button to remove a patient (with confirmation)

### 📅 Scheduling Appointments

**Access:** Secretary and Admin roles only

1. Click the **"Appointments"** tab
2. Click **"+ Schedule Appointment"** button
3. Enter appointment details:
   - **Appointment ID**: Unique identifier
   - **Patient ID**: Must match an existing patient
   - **Date & Time**: Select date and time using the datetime picker
   - **Status**: Choose from:
     - `Scheduled` - Upcoming appointment
     - `Attended` - Patient attended
     - `Missed` - Patient did not show
     - `Cancelled` - Appointment was cancelled
4. Click **"Save Appointment"**

**Viewing Appointments:**
- All appointments are displayed in a table showing patient name, date, and status
- Use color-coded status badges to quickly identify appointment status

### 👨‍⚕️ Managing Staff

**Access:** All logged-in users

1. Click the **"Staff"** tab
2. Click **"+ Add Staff Member"** button
3. Enter employee information:
   - **Employee ID**: Unique identifier
   - **First Name & Last Name**: Employee's full name
   - **Phone**: Contact number
   - **Email**: Email address
4. Click **"Save Staff Member"**

**Note:** Role assignment (Secretary, Dental Staff, Billing Admin) is managed through the database relationships. Employees can have multiple roles.

### 🦷 Adding Treatments

**Access:** All logged-in users

1. Click the **"Treatments"** tab
2. Click **"+ Add Treatment"** button
3. Enter treatment details:
   - **Treatment ID**: Unique identifier
   - **Treatment Name**: Name of the treatment (e.g., "Teeth Cleaning", "Root Canal")
   - **Cost**: Price in dollars (decimal values supported)
4. Click **"Save Treatment"**

**Example Treatments:**
- Teeth Cleaning: $120.00
- Cavity Filling: $200.00
- Root Canal: $750.00
- Braces Adjustment: $150.00
- Tooth Extraction: $300.00

### 🔗 Recording Services (Appointment Treatments)

**Access:** Secretary and Admin roles only

1. Click the **"Services"** tab
2. Click **"+ Add Service"** button
3. Link a treatment to an appointment:
   - **Service ID**: Unique identifier
   - **Appointment ID**: Must match an existing appointment
   - **Treatment ID**: Must match an existing treatment
   - **Quantity**: Number of treatments (default: 1)
4. Click **"Save Service"**

This creates a record linking a specific treatment to an appointment, which can then be billed.

### 💰 Financial Management

**Access:** Billing Admin and Admin roles only

1. Click the **"Financial"** tab
2. Click **"+ Add Financial Record"** button
3. Enter billing information:
   - **Bill ID**: Unique identifier
   - **Service ID**: Links to an appointment treatment record
   - **Amount**: Total amount to be billed
   - **Payment Status**: Choose from:
     - `Paid` - Payment received
     - `Pending` - Awaiting payment
     - `Overdue` - Payment past due
4. Click **"Save Record"**

**Financial Tracking:**
- View all financial records in a table
- Monitor payment status with color-coded badges
- Track amounts owed and paid

### 📊 Generating Reports

**Access:** All logged-in users

1. Click the **"Reports"** tab
2. Choose from 6 available analytical reports:
   - **Attended Patients Report**: Patients who attended appointments and never missed any
   - **Above Average Appointments**: Patients with appointment counts above clinic average
   - **Unassigned Staff**: Employees not assigned to specific roles
   - **Secretary Schedule**: Secretaries working on specific dates
   - **Top Revenue Treatments**: Top 3 highest earning treatments
   - **Treatment Analytics**: Average costs and payment status by treatment
3. Click **"Generate Report"** on any report card
4. View results displayed in a formatted table

**Report Features:**
- Real-time data analysis
- Formatted table display
- Scrollable results for large datasets

### ⚙️ Database Administration

**Access:** Admin role only (Employee ID: 999)

1. Click the **"Admin"** tab
2. Available actions:
   - **Create Tables**: Initialize all database tables (run once on first setup)
   - **Populate Data**: Add sample data to the database
   - **Drop All Tables**: ⚠️ **WARNING** - Deletes all tables and data permanently

**Important Notes:**
- Database operations are irreversible
- Always backup data before dropping tables
- Create tables before populating data



