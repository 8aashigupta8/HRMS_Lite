# HRMS-Lite
## Project Overview
A lightweight Human Resource Management System. It allows an admin to manage employees and track daily attendance through a clean, professional web interface. The project focuses on core HR operations with stable functionality, clean UI, and production-ready deployment. 
It consists of two maiin feature - Employee Management and Attendance Management.
### Employee Management:
1. Add a new employee with the following details-
   - Employee Id
   - Full Name
   - Email Address
   - Department
2. View a list of all employees
3. Delete an employee
4. Search Employee

### Attendance Management:
1. Mark attendance for an employee with:
   - Date
   - Status (Present / Absent)
2. View attendance records for each employee

### Bonus feature
Display total number of present days per employee in Employees tab.

## Tech stack used
Frontend:
- Tailwind CSS
- HTML
- Vanilla JavaScript

Backend:
- Python
- Django
- Django Rest Framework

Database:
- SQLite (local development)
- PostgreSQL (production on Render)

Deployment:
- Render (Backend + Frontend served via Django)
- Gunicorn (WSGI server)

## Steps to run the project locally
### 1. Clone the repository
git clone https://github.com/8aashigupta8/HRMS_Lite.git
cd HRMS_Lite/backend
### 2. Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
### 3. Install dependencies
pip install -r requirements.txt
### 4. Run migrations
python manage.py migrate
### 5. Collect static files
python manage.py collectstatic
### 6. Start the server
python manage.py runserver
Open in browser - http://127.0.0.1:8000

## Assumptions and Limitations
- Single admin user (no authentication)
- No role management
- No payroll or leave management
- Designed as an internal HR tool
- Focused on core functionality and stability

## Optional Enhancements Implemented

- Search functionality
- Attendance editing
- Total present count per employee
