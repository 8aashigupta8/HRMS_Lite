import { api } from './api.js';
import { ui } from './ui.js';

class App {
    constructor() {
        this.currentView = 'employees';
        this.init();
    }

    init() {
        document.getElementById('nav-employees').addEventListener('click', () => this.switchView('employees'));
        document.getElementById('nav-attendance').addEventListener('click', () => this.switchView('attendance'));

        // Global handlers
        window.deleteEmployee = (id) => this.handleDeleteEmployee(id);
        window.editAttendance = (id, empId, date, status) => this.startEditAttendance(id, empId, date, status);

        this.switchView('employees');
        this.editingAttendanceId = null;
    }

    // ... (switchView remains same) ...

    startEditAttendance(id, empId, date, status) {
        this.editingAttendanceId = id;

        // Populate form
        document.getElementById('employee').value = empId;
        document.getElementById('date').value = date;
        document.getElementById('status').value = status;

        // Update UI
        document.getElementById('attendance-form-title').textContent = 'Update Attendance';
        document.getElementById('attendance-submit-btn').textContent = 'Update';

        const cancelBtn = document.getElementById('attendance-cancel-btn');
        cancelBtn.classList.remove('hidden');
        cancelBtn.onclick = () => this.resetAttendanceForm();

        // Scroll to form
        document.getElementById('mark-attendance-form').scrollIntoView({ behavior: 'smooth' });
    }

    resetAttendanceForm() {
        this.editingAttendanceId = null;
        document.getElementById('mark-attendance-form').reset();
        document.getElementById('attendance-form-title').textContent = 'Mark Attendance';
        document.getElementById('attendance-submit-btn').textContent = 'Mark Attendance';
        document.getElementById('attendance-cancel-btn').classList.add('hidden');
    }

    attachAttendanceFormListener() {
        const form = document.getElementById('mark-attendance-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    if (this.editingAttendanceId) {
                        await api.updateAttendance(this.editingAttendanceId, data);
                        ui.showAlert('Attendance updated successfully!', 'success');
                    } else {
                        await api.markAttendance(data);
                        ui.showAlert('Attendance marked successfully!', 'success');
                    }
                    this.resetAttendanceForm();
                    this.loadAttendanceView(); // Refresh list to see changes
                } catch (error) {
                    ui.showAlert('Error: ' + error.message);
                }
            });
        }
    }

    async switchView(viewName) {
        this.currentView = viewName;
        this.updateNav();
        ui.showLoading();

        try {
            if (viewName === 'employees') {
                this.loadEmployeeView();
            } else {
                this.loadAttendanceView();
            }
        } catch (error) {
            ui.showAlert('Failed to load data: ' + error.message);
        }
    }

    async loadEmployeeView(searchTerm = '') {
        try {
            ui.showLoading();
            const employees = await api.fetchEmployees(searchTerm);
            ui.renderEmployeeView(employees);
            this.attachEmployeeFormListener();
            this.attachEmployeeSearchListener();

            // Restore search term if re-rendering
            const searchInput = document.getElementById('search-employees');
            if (searchInput) searchInput.value = searchTerm;
        } catch (error) {
            ui.showAlert('Failed to load employees: ' + error.message);
        }
    }

    attachEmployeeSearchListener() {
        const btn = document.getElementById('search-emp-btn');
        const input = document.getElementById('search-employees');

        if (btn && input) {
            const performSearch = () => {
                const term = input.value.trim();
                this.loadEmployeeView(term);
            };

            btn.addEventListener('click', performSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }
    }

    async loadAttendanceView(searchTerm = '') {
        try {
            ui.showLoading();
            const [attendance, employees] = await Promise.all([
                api.fetchAttendance(searchTerm),
                api.fetchEmployees()
            ]);
            ui.renderAttendanceView(attendance, employees);
            this.attachAttendanceFormListener();
            this.attachSearchListener();

            // Restore search term if re-rendering
            const searchInput = document.getElementById('search-attendance');
            if (searchInput) searchInput.value = searchTerm;

        } catch (error) {
            ui.showAlert('Failed to load attendance: ' + error.message);
        }
    }

    attachSearchListener() {
        const btn = document.getElementById('search-btn');
        const input = document.getElementById('search-attendance');

        if (btn && input) {
            const performSearch = () => {
                const term = input.value.trim();
                this.loadAttendanceView(term);
            };

            btn.addEventListener('click', performSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }
    }

    updateNav() {
        const empBtn = document.getElementById('nav-employees');
        const attBtn = document.getElementById('nav-attendance');

        const activeClass = 'border-indigo-500 text-gray-900';
        const inactiveClass = 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

        if (this.currentView === 'employees') {
            empBtn.className = empBtn.className.replace(inactiveClass, '').replace(activeClass, '') + ' ' + activeClass;
            attBtn.className = attBtn.className.replace(activeClass, '').replace(inactiveClass, '') + ' ' + inactiveClass;
        } else {
            attBtn.className = attBtn.className.replace(inactiveClass, '').replace(activeClass, '') + ' ' + activeClass;
            empBtn.className = empBtn.className.replace(activeClass, '').replace(inactiveClass, '') + ' ' + inactiveClass;
        }
    }

    attachEmployeeFormListener() {
        const form = document.getElementById('add-employee-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    await api.createEmployee(data);
                    ui.showAlert('Employee added successfully!', 'success');
                    this.loadEmployeeView(); // Refresh
                } catch (error) {
                    ui.showAlert('Error adding employee: ' + error.message);
                }
            });
        }
    }

    attachAttendanceFormListener() {
        const form = document.getElementById('mark-attendance-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    if (this.editingAttendanceId) {
                        await api.updateAttendance(this.editingAttendanceId, data);
                        ui.showAlert('Attendance updated successfully!', 'success');
                    } else {
                        await api.markAttendance(data);
                        ui.showAlert('Attendance marked successfully!', 'success');
                    }
                    this.resetAttendanceForm();
                    // Determine search term to stay on same view? For now just reload.
                    this.loadAttendanceView();
                } catch (error) {
                    ui.showAlert('Error: ' + error.message);
                }
            });
        }
    }

    async handleDeleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.deleteEmployee(id);
                ui.showAlert('Employee deleted.', 'success');
                this.loadEmployeeView();
            } catch (error) {
                ui.showAlert('Failed to delete employee: ' + error.message);
            }
        }
    }
}

// Start App
new App();
