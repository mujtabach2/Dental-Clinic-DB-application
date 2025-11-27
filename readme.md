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

**Deployed on Vercel**: https://dental-clinic-db-application-90j6r3kjy-mujtabach2s-projects.vercel.app/

## 🏗️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern responsive design with gradients and animations
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - RESTful API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **better-sqlite3** - Fast, synchronous SQLite database
- **CORS** - Cross-origin resource sharing

### Deployment
- **Vercel** - Serverless deployment platform
- **Serverless Functions** - API endpoints as serverless functions

## 📖 Usage Guide

### First Time Setup

1. **Initialize Database**
   - Go to Admin tab
   - Click "Create Tables"
   - Wait for success message

2. **Add Sample Data** 
   - Click "Populate Data"
   - This adds 5 patients, 7 appointments, 8 employees, 5 treatments, and financial records

### Managing Patients

1. Click **"Patients"** tab
2. Click **"+ Add New Patient"**
3. Fill in patient information:
   - Patient ID (unique identifier)
   - Name, DOB, Address
   - Contact information
   - Medical history
4. Click **"Save Patient"**

To edit or delete, use the action buttons in the table.

### Scheduling Appointments

1. Click **"Appointments"** tab
2. Click **"+ Schedule Appointment"**
3. Enter:
   - Appointment ID
   - Patient ID (must exist)
   - Date & Time
   - Status (Scheduled/Attended/Missed/Cancelled)
4. Click **"Save Appointment"**

### Managing Staff

1. Click **"Staff"** tab
2. Click **"+ Add Staff Member"**
3. Enter employee details
4. Assign roles via database (Secretary, Dental Staff, Billing Admin)

### Adding Treatments

1. Click **"Treatments"** tab
2. Click **"+ Add Treatment"**
3. Define treatment name and cost
4. Save to catalog

### Recording Services

1. Click **"Services"** tab
2. Link treatments to appointments
3. Specify quantity of each treatment

### Financial Management

1. Click **"Financial"** tab
2. Track billing records
3. Monitor payment status (Paid/Pending/Overdue)
4. View amounts owed

### Generating Reports

1. Click **"Reports"** tab
2. Choose from 6 analytical reports
3. Click **"Generate Report"**
4. View results in table format

## 🗄️ Database Schema

### Core Tables

- **Patient** - Patient demographic and medical information
- **Appointment** - Scheduled visits with status tracking
- **Employee** - Staff member information
- **Treatment** - Available treatments and pricing
- **Appointment_Treatment** - Links treatments to appointments
- **Financial_Record** - Billing and payment tracking

### Supporting Tables

- **Secretary** - Front desk staff
- **Dental_Staff** - Dentists and hygienists
- **Billing_Admin** - Billing administrators
- **Part_Time** - Hourly wage employees
- **Full_Time** - Salaried employees
- **Schedule** - Employee work schedules
