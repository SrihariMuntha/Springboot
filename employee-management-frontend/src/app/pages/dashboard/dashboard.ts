import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { DepartmentService } from '../../services/department';
import { Employee } from '../../models/employee';
import { Department } from '../../models/department';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  employees: Employee[] = [];
  departments: Department[] = [];

  totalEmployees = 0;
  totalDepartments = 0;
  totalSalary = 0;
  averageSalary = 0;

  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.totalEmployees = data.length;

        this.totalSalary = data.reduce(
          (total, emp) => total + emp.salary, 0
        );

        this.averageSalary = this.totalEmployees > 0
          ? this.totalSalary / this.totalEmployees
          : 0;
      },
      error: () => {
        this.errorMessage = 'Unable to load employee information.';
      }
    });

    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.totalDepartments = data.length;
      },
      error: () => {
        this.errorMessage = 'Unable to load department information.';
      }
    });
  }
}

export class DashboardComponent {
}
