# Dental Clinic Management System - Frontend

A modern, responsive web interface for the Dental Clinic Database Management System.

## Features

- **Patients Management**: Full CRUD operations for patient records
- **Appointments Management**: Schedule and manage appointments
- **Employees Management**: Manage staff information
- **Treatments Management**: Manage available treatments and their costs
- **Appointment Treatments**: Link treatments to appointments
- **Financial Records**: Track billing and payment status
- **Advanced Reports**: Generate various analytical reports
- **Admin Tools**: Database initialization and management

## Setup

1. Make sure the backend server is running on `http://localhost:3001`

2. Open `index.html` in a web browser, or use a local server:

   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server -p 8000
   ```

3. Navigate to `http://localhost:8000` in your browser

## Usage

- Use the navigation tabs at the top to switch between different sections
- Click "Add" buttons to create new records
- Click "Edit" to modify existing records
- Click "Delete" to remove records (with confirmation)
- Use the Reports section to generate analytical reports
- Use the Admin section to manage the database (create tables, populate data, etc.)

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:3001/api`. If your backend runs on a different port or host, update the `API_BASE` constant in `app.js`:

```javascript
const API_BASE = 'http://localhost:3001/api';
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Notes

- The frontend uses modern JavaScript (ES6+) and Fetch API
- All API calls are asynchronous
- Error messages are displayed via alerts
- Forms include basic validation

