from rest_framework import viewsets, filters
from django.shortcuts import render
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from .authentication import CsrfExemptSessionAuthentication

def home(request):
    return render(request, "index.html")

# @method_decorator(csrf_exempt, name="dispatch")
class EmployeeViewSet(viewsets.ModelViewSet):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'email', 'employee_id']

# @method_decorator(csrf_exempt, name="dispatch")
class AttendanceViewSet(viewsets.ModelViewSet):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['employee__full_name']

    def get_queryset(self):
        """
        Optionally restricts the returned attendance to a given employee,
        by filtering against a `employee_id` query parameter in the URL.
        """
        queryset = Attendance.objects.all().order_by('-date')
        employee_id = self.request.query_params.get('employee_id')
        if employee_id is not None:
             queryset = queryset.filter(employee__id=employee_id)
        return queryset
