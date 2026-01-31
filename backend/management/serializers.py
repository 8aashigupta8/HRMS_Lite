from rest_framework import serializers
from .models import Employee, Attendance
from datetime import date

class EmployeeSerializer(serializers.ModelSerializer):
    total_present = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at', 'total_present']

    def get_total_present(self, obj):
        return obj.attendance_records.filter(status='Present').count()

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.full_name')
    employee_id_code = serializers.ReadOnlyField(source='employee.employee_id')

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'employee_id_code', 'date', 'status']

    def validate(self, data):
        """
        Check that attendance hasn't already been marked for this employee on this date.
        """
        employee = data.get('employee')
        attendance_date = data.get('date')
        
        # If instance exists (update), exclude it from check
        qs = Attendance.objects.filter(employee=employee, date=attendance_date)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
            
        if qs.exists():
             raise serializers.ValidationError("Attendance already marked for this employee on this date.")
        
        return data
