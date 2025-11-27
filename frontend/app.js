const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    adminAction('create');
    adminAction('populate');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            loadTabData(targetTab);
        });
    });
});


function loadTabData(tab) {
    switch(tab) {
        case 'patients':
            loadPatients();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'employees':
            loadEmployees();
            break;
        case 'treatments':
            loadTreatments();
            break;
        case 'appointment-treatments':
            loadAppointmentTreatments();
            break;
        case 'financial':
            loadFinancialRecords();
            break;
    }
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const url = `${API_BASE}${endpoint}`;
        
        const response = await fetch(url, options);
        
        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            throw new Error(`Server returned HTML instead of JSON. Endpoint: ${endpoint}\nMake sure the backend server is running on port 3001`);
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}
// ========== PATIENTS ==========
async function loadPatients() {
    try {
        const patients = await apiCall('/patients');
        const tbody = document.getElementById('patients-tbody');
        
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No patients found</td></tr>';
            return;
        }
        
        tbody.innerHTML = patients.map(p => `
            <tr>
                <td>${p.patientID}</td>
                <td>${p.pfirst_name} ${p.plast_name}</td>
                <td>${p.pDOB || 'N/A'}</td>
                <td>${p.pphone || 'N/A'}</td>
                <td>${p.pemail || 'N/A'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editPatient('${p.patientID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deletePatient('${p.patientID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('patients-tbody').innerHTML = 
            '<tr><td colspan="6" class="empty-state">Error loading patients</td></tr>';
    }
}

function showPatientForm(patientId = null) {
    const form = document.getElementById('patient-form');
    const title = document.getElementById('patient-form-title');
    const formElement = document.getElementById('patientForm');
    
    if (patientId) {
        title.textContent = 'Edit Patient';
        loadPatientData(patientId);
    } else {
        title.textContent = 'Add Patient';
        formElement.reset();
        document.getElementById('patient-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closePatientForm() {
    document.getElementById('patient-form').style.display = 'none';
}

async function loadPatientData(patientID) {
    try {
        const patient = await apiCall(`/patients/${patientID}`);
        document.getElementById('patient-id').value = patient.patientID;
        document.getElementById('patient-patientID').value = patient.patientID;
        document.getElementById('patient-pfirst_name').value = patient.pfirst_name || '';
        document.getElementById('patient-plast_name').value = patient.plast_name || '';
        document.getElementById('patient-pDOB').value = patient.pDOB || '';
        document.getElementById('patient-paddress').value = patient.paddress || '';
        document.getElementById('patient-pphone').value = patient.pphone || '';
        document.getElementById('patient-pemail').value = patient.pemail || '';
        document.getElementById('patient-medical_history').value = patient.medical_history || '';
    } catch (error) {
        alert('Error loading patient data');
    }
}

async function savePatient(event) {
    event.preventDefault();
    const patientID = document.getElementById('patient-id').value;
    const data = {
        patientID: document.getElementById('patient-patientID').value,
        pfirst_name: document.getElementById('patient-pfirst_name').value,
        plast_name: document.getElementById('patient-plast_name').value,
        pDOB: document.getElementById('patient-pDOB').value,
        paddress: document.getElementById('patient-paddress').value,
        pphone: document.getElementById('patient-pphone').value,
        pemail: document.getElementById('patient-pemail').value,
        medical_history: document.getElementById('patient-medical_history').value
    };
    
    try {
        if (patientID) {
            await apiCall(`/patients/${patientID}`, 'PUT', data);
            alert('Patient updated successfully!');
        } else {
            await apiCall('/patients', 'POST', data);
            alert('Patient added successfully!');
        }
        closePatientForm();
        loadPatients();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editPatient(patientID) {
    showPatientForm(patientID);
}

async function deletePatient(patientID) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    try {
        await apiCall(`/patients/${patientID}`, 'DELETE');
        alert('Patient deleted successfully!');
        loadPatients();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== APPOINTMENTS ==========
async function loadAppointments() {
    try {
        const appointments = await apiCall('/appointments');
        const tbody = document.getElementById('appointments-tbody');
        
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No appointments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = appointments.map(a => `
            <tr>
                <td>${a.appointmentID}</td>
                <td>${a.pfirst_name || ''} ${a.plast_name || ''} (${a.patientID || 'N/A'})</td>
                <td>${a.appointment_date || 'N/A'}</td>
                <td><span class="status-badge status-${a.status?.toLowerCase()}">${a.status || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="editAppointment('${a.appointmentID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteAppointment('${a.appointmentID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('appointments-tbody').innerHTML = 
            '<tr><td colspan="5" class="empty-state">Error loading appointments</td></tr>';
    }
}

function showAppointmentForm(appointmentID = null) {
    const form = document.getElementById('appointment-form');
    const title = document.getElementById('appointment-form-title');
    const formElement = document.getElementById('appointmentForm');
    
    if (appointmentID) {
        title.textContent = 'Edit Appointment';
        loadAppointmentData(appointmentID);
    } else {
        title.textContent = 'Add Appointment';
        formElement.reset();
        document.getElementById('appointment-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closeAppointmentForm() {
    document.getElementById('appointment-form').style.display = 'none';
}

async function loadAppointmentData(appointmentID) {
    try {
        const appointment = await apiCall(`/appointments/${appointmentID}`);
        document.getElementById('appointment-id').value = appointment.appointmentID;
        document.getElementById('appointment-appointmentID').value = appointment.appointmentID;
        document.getElementById('appointment-patientID').value = appointment.patientID || '';
        document.getElementById('appointment-date').value = appointment.appointment_date ? 
            appointment.appointment_date.replace(' ', 'T').substring(0, 16) : '';
        document.getElementById('appointment-status').value = appointment.status || 'Scheduled';
    } catch (error) {
        alert('Error loading appointment data');
    }
}

async function saveAppointment(event) {
    event.preventDefault();
    const appointmentID = document.getElementById('appointment-id').value;
    const dateValue = document.getElementById('appointment-date').value;
    const data = {
        appointmentID: document.getElementById('appointment-appointmentID').value,
        patientID: document.getElementById('appointment-patientID').value,
        appointment_date: dateValue.replace('T', ' '),
        status: document.getElementById('appointment-status').value
    };
    
    try {
        if (appointmentID) {
            await apiCall(`/appointments/${appointmentID}`, 'PUT', data);
            alert('Appointment updated successfully!');
        } else {
            await apiCall('/appointments', 'POST', data);
            alert('Appointment added successfully!');
        }
        closeAppointmentForm();
        loadAppointments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editAppointment(appointmentID) {
    showAppointmentForm(appointmentID);
}

async function deleteAppointment(appointmentID) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
        await apiCall(`/appointments/${appointmentID}`, 'DELETE');
        alert('Appointment deleted successfully!');
        loadAppointments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== EMPLOYEES ==========
async function loadEmployees() {
    try {
        const employees = await apiCall('/employees');
        const tbody = document.getElementById('employees-tbody');
        
        if (employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No employees found</td></tr>';
            return;
        }
        
        tbody.innerHTML = employees.map(e => `
            <tr>
                <td>${e.empID}</td>
                <td>${e.efirst_name} ${e.elast_name}</td>
                <td>${e.ephone_num || 'N/A'}</td>
                <td>${e.eemail || 'N/A'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editEmployee('${e.empID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteEmployee('${e.empID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('employees-tbody').innerHTML = 
            '<tr><td colspan="5" class="empty-state">Error loading employees</td></tr>';
    }
}

function showEmployeeForm(empID = null) {
    const form = document.getElementById('employee-form');
    const title = document.getElementById('employee-form-title');
    const formElement = document.getElementById('employeeForm');
    
    if (empID) {
        title.textContent = 'Edit Employee';
        loadEmployeeData(empID);
    } else {
        title.textContent = 'Add Employee';
        formElement.reset();
        document.getElementById('employee-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closeEmployeeForm() {
    document.getElementById('employee-form').style.display = 'none';
}

async function loadEmployeeData(empID) {
    try {
        const employee = await apiCall(`/employees/${empID}`);
        document.getElementById('employee-id').value = employee.empID;
        document.getElementById('employee-empID').value = employee.empID;
        document.getElementById('employee-efirst_name').value = employee.efirst_name || '';
        document.getElementById('employee-elast_name').value = employee.elast_name || '';
        document.getElementById('employee-ephone_num').value = employee.ephone_num || '';
        document.getElementById('employee-eemail').value = employee.eemail || '';
    } catch (error) {
        alert('Error loading employee data');
    }
}

async function saveEmployee(event) {
    event.preventDefault();
    const empID = document.getElementById('employee-id').value;
    const data = {
        empID: document.getElementById('employee-empID').value,
        efirst_name: document.getElementById('employee-efirst_name').value,
        elast_name: document.getElementById('employee-elast_name').value,
        ephone_num: document.getElementById('employee-ephone_num').value,
        eemail: document.getElementById('employee-eemail').value
    };
    
    try {
        if (empID) {
            await apiCall(`/employees/${empID}`, 'PUT', data);
            alert('Employee updated successfully!');
        } else {
            await apiCall('/employees', 'POST', data);
            alert('Employee added successfully!');
        }
        closeEmployeeForm();
        loadEmployees();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editEmployee(empID) {
    showEmployeeForm(empID);
}

async function deleteEmployee(empID) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
        await apiCall(`/employees/${empID}`, 'DELETE');
        alert('Employee deleted successfully!');
        loadEmployees();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== TREATMENTS ==========
async function loadTreatments() {
    try {
        const treatments = await apiCall('/treatments');
        const tbody = document.getElementById('treatments-tbody');
        
        if (treatments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No treatments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = treatments.map(t => `
            <tr>
                <td>${t.treatmentID}</td>
                <td>${t.treatmentName}</td>
                <td>$${parseFloat(t.cost || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-edit" onclick="editTreatment('${t.treatmentID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteTreatment('${t.treatmentID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('treatments-tbody').innerHTML = 
            '<tr><td colspan="4" class="empty-state">Error loading treatments</td></tr>';
    }
}

function showTreatmentForm(treatmentID = null) {
    const form = document.getElementById('treatment-form');
    const title = document.getElementById('treatment-form-title');
    const formElement = document.getElementById('treatmentForm');
    
    if (treatmentID) {
        title.textContent = 'Edit Treatment';
        loadTreatmentData(treatmentID);
    } else {
        title.textContent = 'Add Treatment';
        formElement.reset();
        document.getElementById('treatment-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closeTreatmentForm() {
    document.getElementById('treatment-form').style.display = 'none';
}

async function loadTreatmentData(treatmentID) {
    try {
        const treatment = await apiCall(`/treatments/${treatmentID}`);
        document.getElementById('treatment-id').value = treatment.treatmentID;
        document.getElementById('treatment-treatmentID').value = treatment.treatmentID;
        document.getElementById('treatment-treatmentName').value = treatment.treatmentName || '';
        document.getElementById('treatment-cost').value = treatment.cost || '';
    } catch (error) {
        alert('Error loading treatment data');
    }
}

async function saveTreatment(event) {
    event.preventDefault();
    const treatmentID = document.getElementById('treatment-id').value;
    const data = {
        treatmentID: document.getElementById('treatment-treatmentID').value,
        treatmentName: document.getElementById('treatment-treatmentName').value,
        cost: parseFloat(document.getElementById('treatment-cost').value)
    };
    
    try {
        if (treatmentID) {
            await apiCall(`/treatments/${treatmentID}`, 'PUT', data);
            alert('Treatment updated successfully!');
        } else {
            await apiCall('/treatments', 'POST', data);
            alert('Treatment added successfully!');
        }
        closeTreatmentForm();
        loadTreatments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editTreatment(treatmentID) {
    showTreatmentForm(treatmentID);
}

async function deleteTreatment(treatmentID) {
    if (!confirm('Are you sure you want to delete this treatment?')) return;
    
    try {
        await apiCall(`/treatments/${treatmentID}`, 'DELETE');
        alert('Treatment deleted successfully!');
        loadTreatments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== APPOINTMENT TREATMENTS ==========
async function loadAppointmentTreatments() {
    try {
        const apptTreats = await apiCall('/appointment_treatments');
        const tbody = document.getElementById('appointment-treatments-tbody');
        
        if (apptTreats.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No appointment treatments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = apptTreats.map(at => `
            <tr>
                <td>${at.apptTreatID}</td>
                <td>${at.appointmentID} ${at.appointment_date ? `(${at.appointment_date})` : ''}</td>
                <td>${at.treatmentID} ${at.treatmentName ? `(${at.treatmentName})` : ''}</td>
                <td>${at.quantity || 1}</td>
                <td>
                    <button class="btn btn-edit" onclick="editAppointmentTreatment('${at.apptTreatID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteAppointmentTreatment('${at.apptTreatID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('appointment-treatments-tbody').innerHTML = 
            '<tr><td colspan="5" class="empty-state">Error loading appointment treatments</td></tr>';
    }
}

function showAppointmentTreatmentForm(apptTreatID = null) {
    const form = document.getElementById('appointment-treatment-form');
    const title = document.getElementById('appointment-treatment-form-title');
    const formElement = document.getElementById('appointmentTreatmentForm');
    
    if (apptTreatID) {
        title.textContent = 'Edit Appointment Treatment';
        loadAppointmentTreatmentData(apptTreatID);
    } else {
        title.textContent = 'Add Appointment Treatment';
        formElement.reset();
        document.getElementById('appointment-treatment-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closeAppointmentTreatmentForm() {
    document.getElementById('appointment-treatment-form').style.display = 'none';
}

async function loadAppointmentTreatmentData(apptTreatID) {
    try {
        const apptTreat = await apiCall(`/appointment_treatments/${apptTreatID}`);
        document.getElementById('appointment-treatment-id').value = apptTreat.apptTreatID;
        document.getElementById('appointment-treatment-apptTreatID').value = apptTreat.apptTreatID;
        document.getElementById('appointment-treatment-appointmentID').value = apptTreat.appointmentID || '';
        document.getElementById('appointment-treatment-treatmentID').value = apptTreat.treatmentID || '';
        document.getElementById('appointment-treatment-quantity').value = apptTreat.quantity || 1;
    } catch (error) {
        alert('Error loading appointment treatment data');
    }
}

async function saveAppointmentTreatment(event) {
    event.preventDefault();
    const apptTreatID = document.getElementById('appointment-treatment-id').value;
    const data = {
        apptTreatID: document.getElementById('appointment-treatment-apptTreatID').value,
        appointmentID: document.getElementById('appointment-treatment-appointmentID').value,
        treatmentID: document.getElementById('appointment-treatment-treatmentID').value,
        quantity: parseInt(document.getElementById('appointment-treatment-quantity').value) || 1
    };
    
    try {
        if (apptTreatID) {
            await apiCall(`/appointment_treatments/${apptTreatID}`, 'PUT', data);
            alert('Appointment Treatment updated successfully!');
        } else {
            await apiCall('/appointment_treatments', 'POST', data);
            alert('Appointment Treatment added successfully!');
        }
        closeAppointmentTreatmentForm();
        loadAppointmentTreatments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editAppointmentTreatment(apptTreatID) {
    showAppointmentTreatmentForm(apptTreatID);
}

async function deleteAppointmentTreatment(apptTreatID) {
    if (!confirm('Are you sure you want to delete this appointment treatment?')) return;
    
    try {
        await apiCall(`/appointment_treatments/${apptTreatID}`, 'DELETE');
        alert('Appointment Treatment deleted successfully!');
        loadAppointmentTreatments();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== FINANCIAL RECORDS ==========
async function loadFinancialRecords() {
    try {
        const records = await apiCall('/financial_records');
        const tbody = document.getElementById('financial-tbody');
        
        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No financial records found</td></tr>';
            return;
        }
        
        tbody.innerHTML = records.map(fr => `
            <tr>
                <td>${fr.billID}</td>
                <td>${fr.apptTreatID || 'N/A'}</td>
                <td>$${parseFloat(fr.amount || 0).toFixed(2)}</td>
                <td><span class="status-badge status-${fr.status?.toLowerCase()}">${fr.status || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="editFinancialRecord('${fr.billID}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteFinancialRecord('${fr.billID}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        document.getElementById('financial-tbody').innerHTML = 
            '<tr><td colspan="5" class="empty-state">Error loading financial records</td></tr>';
    }
}

function showFinancialForm(billID = null) {
    const form = document.getElementById('financial-form');
    const title = document.getElementById('financial-form-title');
    const formElement = document.getElementById('financialForm');
    
    if (billID) {
        title.textContent = 'Edit Financial Record';
        loadFinancialRecordData(billID);
    } else {
        title.textContent = 'Add Financial Record';
        formElement.reset();
        document.getElementById('financial-id').value = '';
    }
    
    form.style.display = 'flex';
}

function closeFinancialForm() {
    document.getElementById('financial-form').style.display = 'none';
}

async function loadFinancialRecordData(billID) {
    try {
        const record = await apiCall(`/financial_records/${billID}`);
        document.getElementById('financial-id').value = record.billID;
        document.getElementById('financial-financialID').value = record.billID;
        document.getElementById('financial-apptTreatID').value = record.apptTreatID || '';
        document.getElementById('financial-amount').value = record.amount || '';
        document.getElementById('financial-status').value = record.status || 'Pending';
    } catch (error) {
        alert('Error loading financial record data');
    }
}

async function saveFinancialRecord(event) {
    event.preventDefault();
    const billID = document.getElementById('financial-id').value;
    const data = {
        billID: document.getElementById('financial-financialID').value,
        apptTreatID: document.getElementById('financial-apptTreatID').value,
        amount: parseFloat(document.getElementById('financial-amount').value),
        status: document.getElementById('financial-status').value
    };
    
    try {
        if (billID) {
            await apiCall(`/financial_records/${billID}`, 'PUT', data);
            alert('Financial Record updated successfully!');
        } else {
            await apiCall('/financial_records', 'POST', data);
            alert('Financial Record added successfully!');
        }
        closeFinancialForm();
        loadFinancialRecords();
    } catch (error) {
        // Error already handled in apiCall
    }
}

async function editFinancialRecord(billID) {
    showFinancialForm(billID);
}

async function deleteFinancialRecord(billID) {
    if (!confirm('Are you sure you want to delete this financial record?')) return;
    
    try {
        await apiCall(`/financial_records/${billID}`, 'DELETE');
        alert('Financial Record deleted successfully!');
        loadFinancialRecords();
    } catch (error) {
        // Error already handled in apiCall
    }
}

// ========== REPORTS ==========
async function loadReport(reportName, resultId) {
    const resultDiv = document.getElementById(resultId);
    resultDiv.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const data = await apiCall(`/reports/${reportName}`);
        
        if (data.length === 0) {
            resultDiv.innerHTML = '<div class="empty-state">No data found</div>';
            return;
        }
        
        const keys = Object.keys(data[0]);
        let html = '<table><thead><tr>';
        keys.forEach(key => {
            html += `<th>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        data.forEach(row => {
            html += '<tr>';
            keys.forEach(key => {
                html += `<td>${row[key] || 'N/A'}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = '<div class="empty-state">Error loading report</div>';
    }
}

// ========== ADMIN ==========
async function adminAction(action) {
    if (action === 'drop' && !confirm('⚠️ WARNING: This will delete all tables. This action cannot be undone. Are you absolutely sure?')) {
        return;
    }
    
    const messageDiv = document.getElementById('admin-message');
    messageDiv.className = 'message';
    messageDiv.textContent = `Executing ${action}...`;
    messageDiv.style.display = 'block';
    
    try {
        await apiCall(`/admin/${action}`, 'POST');
        messageDiv.className = 'message success';
        messageDiv.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} completed successfully!`;
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error: ${error.message}`;
    }
}

