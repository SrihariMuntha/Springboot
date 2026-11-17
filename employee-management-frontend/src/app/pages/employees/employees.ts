import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { EmployeeService } from '../../services/employee';
import { DepartmentService } from '../../services/department';

import { Employee, EmployeeRequest } from '../../models/employee';
import { Department } from '../../models/department';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  employees: Employee[] = [];
  departments: Department[] = [];

  searchControl = new FormControl('');

  showForm = false;
  editMode = false;
  selectedId = 0;
  errorMessage = '';

  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      salary: [null, [Validators.required, Validators.min(0.01)]],
      departmentId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load employees.';
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.errorMessage = 'Unable to load departments.';
      }
    });
  }

  search(): void {
    const keyword = this.searchControl.value?.trim() || '';

    if (!keyword) {
      this.loadEmployees();
      return;
    }

    this.employeeService.searchEmployee(keyword).subscribe({
      next: (data) => {
        this.employees = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to search employees.';
      }
    });
  }

  openAddForm(): void {

    // Close the form if Add Employee is clicked again.
    if (this.showForm && !this.editMode) {
      this.closeForm();
      return;
    }

    this.showForm = true;
    this.editMode = false;
    this.selectedId = 0;
    this.errorMessage = '';

    this.employeeForm.reset({
      name: '',
      email: '',
      salary: null,
      departmentId: 0
    });
  }

  editEmployee(emp: Employee): void {

    // Close the form if the same employee's Edit button is clicked again.
    if (this.showForm && this.editMode && this.selectedId === emp.id) {
      this.closeForm();
      return;
    }

    this.showForm = true;
    this.editMode = true;
    this.selectedId = emp.id;
    this.errorMessage = '';

    this.employeeForm.patchValue({
      name: emp.name,
      email: emp.email,
      salary: emp.salary,
      departmentId: emp.departmentId
    });
  }

  saveEmployee(): void {

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employee: EmployeeRequest = this.employeeForm.value;

    if (this.editMode) {

      this.employeeService.updateEmployee(
        this.selectedId,
        employee
      ).subscribe({
        next: () => {
          this.closeForm();
          this.loadEmployees();
        },
        error: (error) => {
          this.errorMessage = error.error?.messages
            ? JSON.stringify(error.error.messages)
            : error.error?.error || 'Unable to update employee.';
        }
      });

    } else {

      this.employeeService.addEmployee(employee).subscribe({
        next: () => {
          this.closeForm();
          this.loadEmployees();
        },
        error: (error) => {
          this.errorMessage = error.error?.messages
            ? JSON.stringify(error.error.messages)
            : error.error?.error || 'Unable to add employee.';
        }
      });

    }
  }

  deleteEmployee(id: number): void {

    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: () => {
        this.errorMessage = 'Unable to delete employee.';
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.selectedId = 0;
    this.errorMessage = '';

    this.employeeForm.reset({
      name: '',
      email: '',
      salary: null,
      departmentId: 0
    });
  }
}

export class EmployeesComponent {
}
