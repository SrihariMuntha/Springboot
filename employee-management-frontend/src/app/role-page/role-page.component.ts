import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmployeeService } from '../services/employee.service';
import { StudentService } from '../services/student.service';
import { DepartmentService } from '../services/department';

import { Department, DepartmentRequest } from '../models/department';

import { TableComponent } from '../shared/table/table.component';
import { CardComponent } from '../shared/card/card.component';
import { ButtonComponent } from '../shared/button/button.component';
import { FilterPipe } from '../shared/pipes/filter.pipe';

@Component({
  selector: 'app-role-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    CardComponent,
    ButtonComponent,
    FilterPipe
  ],
  template: `
    <div class="container-fluid p-4">

      <h2>{{ role }} Dashboard</h2>

      <p class="text-muted">
        Manage {{
          role === 'Admin'
            ? 'employees, students and departments'
            : role === 'Employee'
            ? 'employees'
            : 'students'
        }}.
      </p>

      <!-- SEARCH -->
      <input
        class="form-control mb-4"
        placeholder="Search records..."
        [value]="searchText"
        (input)="searchText = $any($event.target).value">

      <!-- SUMMARY CARDS -->
      <div class="row g-3 mb-4">

        <div class="col-md-4" *ngIf="role !== 'Student'">
          <app-card
            title="Total Employees"
            [value]="employees.length">
          </app-card>
        </div>

        <div class="col-md-4" *ngIf="role !== 'Employee'">
          <app-card
            title="Total Students"
            [value]="students.length">
          </app-card>
        </div>

        <div class="col-md-4" *ngIf="role === 'Admin'">
          <app-card
            title="Total Departments"
            [value]="departments.length">
          </app-card>
        </div>

      </div>

      <!-- EMPLOYEE SECTION -->
      <section
        *ngIf="role === 'Admin' || role === 'Employee'"
        class="mb-5">

        <div class="d-flex justify-content-between align-items-center mb-3">

          <h4>Employee List</h4>

          <app-button
            *ngIf="role === 'Admin'"
            label="+ Add Employee"
            (clicked)="openEmployeeForm()">
          </app-button>

        </div>

        <app-table
          [items]="employees | filter: searchText"
          [columns]="employeeColumns"
          [keys]="employeeKeys"
          [showActions]="role === 'Admin'"
          (edit)="editEmployee($event)"
          (delete)="deleteEmployee($event.id)">
        </app-table>

        <!-- EMPLOYEE FORM -->
        <div *ngIf="showEmployeeForm" class="card shadow-sm p-4 mt-4">

          <h4>
            {{ editingEmployeeId ? 'Edit Employee' : 'Add Employee' }}
          </h4>

          <form [formGroup]="employeeForm" (ngSubmit)="saveEmployee()">

            <label class="form-label">Employee Name</label>
            <input
              class="form-control mb-2"
              formControlName="name"
              placeholder="Enter employee name">

            <div
              class="text-danger mb-2"
              *ngIf="employeeForm.controls['name'].invalid &&
                     employeeForm.controls['name'].touched">
              Employee name is required.
            </div>

            <label class="form-label">Email</label>
            <input
              class="form-control mb-2"
              formControlName="email"
              placeholder="Enter email">

            <div
              class="text-danger mb-2"
              *ngIf="employeeForm.controls['email'].invalid &&
                     employeeForm.controls['email'].touched">
              Enter a valid email.
            </div>

            <label class="form-label">Salary</label>
            <input
              type="number"
              class="form-control mb-2"
              formControlName="salary"
              placeholder="Enter salary">

            <div
              class="text-danger mb-2"
              *ngIf="employeeForm.controls['salary'].invalid &&
                     employeeForm.controls['salary'].touched">
              Enter a valid salary greater than zero.
            </div>

            <label class="form-label">Department ID</label>
            <input
              type="number"
              class="form-control mb-3"
              formControlName="departmentId"
              placeholder="Enter department ID">

            <div
              class="text-danger mb-2"
              *ngIf="employeeForm.controls['departmentId'].invalid &&
                     employeeForm.controls['departmentId'].touched">
              Department ID is required.
            </div>

            <button
              type="submit"
              class="btn btn-primary me-2"
              [disabled]="employeeForm.invalid">
              Save Employee
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeForms()">
              Cancel
            </button>

          </form>
        </div>

      </section>

      <!-- STUDENT SECTION -->
      <section *ngIf="role === 'Admin' || role === 'Student'">

        <hr>

        <div class="d-flex justify-content-between align-items-center mb-3">

          <h4>Student List</h4>

          <app-button
            *ngIf="role === 'Admin'"
            label="+ Add Student"
            (clicked)="openStudentForm()">
          </app-button>

        </div>

        <app-table
          [items]="students | filter: searchText"
          [columns]="studentColumns"
          [keys]="studentKeys"
          [showActions]="role === 'Admin'"
          (edit)="editStudent($event)"
          (delete)="deleteStudent($event.id)">
        </app-table>

        <!-- STUDENT FORM -->
        <div *ngIf="showStudentForm" class="card shadow-sm p-4 mt-4">

          <h4>
            {{ editingStudentId ? 'Edit Student' : 'Add Student' }}
          </h4>

          <form [formGroup]="studentForm" (ngSubmit)="saveStudent()">

            <label class="form-label">Student Name</label>
            <input
              class="form-control mb-2"
              formControlName="name"
              placeholder="Enter student name">

            <div
              class="text-danger mb-2"
              *ngIf="studentForm.controls['name'].invalid &&
                     studentForm.controls['name'].touched">
              Student name is required.
            </div>

            <label class="form-label">Email</label>
            <input
              class="form-control mb-2"
              formControlName="email"
              placeholder="Enter email">

            <div
              class="text-danger mb-2"
              *ngIf="studentForm.controls['email'].invalid &&
                     studentForm.controls['email'].touched">
              Enter a valid email.
            </div>

            <label class="form-label">Course</label>
            <input
              class="form-control mb-3"
              formControlName="course"
              placeholder="Enter course">

            <div
              class="text-danger mb-2"
              *ngIf="studentForm.controls['course'].invalid &&
                     studentForm.controls['course'].touched">
              Course is required.
            </div>

            <button
              type="submit"
              class="btn btn-primary me-2"
              [disabled]="studentForm.invalid">
              Save Student
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeForms()">
              Cancel
            </button>

          </form>
        </div>

      </section>

      <!-- DEPARTMENT SECTION: ADMIN ONLY -->
      <section *ngIf="role === 'Admin'" class="mt-5">

        <hr>

        <div class="d-flex justify-content-between align-items-center mb-3">

          <h4>Department List</h4>

          <app-button
            label="+ Add Department"
            (clicked)="openDepartmentForm()">
          </app-button>

        </div>

        <!-- DEPARTMENT TABLE -->
        <div class="card shadow-sm p-3 mb-4">

          <div class="table-responsive">

            <table class="table table-hover align-middle">

              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                <tr *ngFor="let dept of departments | filter: searchText">

                  <td>{{ dept.id }}</td>

                  <td>{{ dept.departmentName }}</td>

                  <td>
                    <button
                      class="btn btn-sm btn-outline-success me-2"
                      (click)="viewDepartmentEmployees(dept.id)">
                      Employees
                    </button>

                    <button
                      class="btn btn-sm btn-outline-primary me-2"
                      (click)="editDepartment(dept)">
                      Edit
                    </button>

                    <button
                      class="btn btn-sm btn-outline-danger"
                      (click)="deleteDepartment(dept.id)">
                      Delete
                    </button>
                  </td>

                </tr>

                <tr *ngIf="departments.length === 0">
                  <td colspan="3" class="text-center text-muted">
                    No departments found.
                  </td>
                </tr>

              </tbody>

            </table>

          </div>
        </div>

        <!-- DEPARTMENT FORM -->
        <div *ngIf="showDepartmentForm" class="card shadow-sm p-4 mb-4">

          <h4>
            {{ editingDepartmentId ? 'Edit Department' : 'Add Department' }}
          </h4>

          <form
            [formGroup]="departmentForm"
            (ngSubmit)="saveDepartment()">

            <label class="form-label">Department Name</label>

            <input
              class="form-control mb-2"
              formControlName="departmentName"
              placeholder="Enter department name">

            <div
              class="text-danger mb-3"
              *ngIf="departmentForm.controls['departmentName'].invalid &&
                     departmentForm.controls['departmentName'].touched">
              Department name is required.
            </div>

            <button
              type="submit"
              class="btn btn-primary me-2"
              [disabled]="departmentForm.invalid">
              {{ editingDepartmentId ? 'Update Department' : 'Save Department' }}
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              (click)="closeForms()">
              Cancel
            </button>

          </form>

        </div>

        <!-- EMPLOYEES IN DEPARTMENT -->
        <div *ngIf="showDepartmentEmployees" class="card shadow-sm p-3 mt-4">

          <div class="d-flex justify-content-between align-items-center mb-3">

            <h5>Department Employees</h5>

            <button
              class="btn btn-secondary btn-sm"
              (click)="closeDepartmentEmployees()">
              Close
            </button>

          </div>

          <table class="table table-hover">

            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
              </tr>
            </thead>

            <tbody>

              <tr *ngFor="let emp of departmentEmployees">
                <td>{{ emp.id }}</td>
                <td>{{ emp.name }}</td>
                <td>{{ emp.email }}</td>
                <td>{{ emp.salary | currency:'INR':'symbol':'1.2-2' }}</td>
              </tr>

              <tr *ngIf="departmentEmployees.length === 0">
                <td colspan="4" class="text-center text-muted">
                  No employees in this department.
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      <!-- ERROR MESSAGE -->
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>

    </div>
  `
})
export class RolePageComponent implements OnInit {

  role = 'Admin';

  employees: any[] = [];
  students: any[] = [];
  departments: Department[] = [];
  departmentEmployees: any[] = [];

  searchText = '';

  showEmployeeForm = false;
  showStudentForm = false;
  showDepartmentForm = false;
  showDepartmentEmployees = false;

  editingEmployeeId: number | null = null;
  editingStudentId: number | null = null;
  editingDepartmentId: number | null = null;

  errorMessage = '';

  employeeColumns = [
    'ID', 'Name', 'Email', 'Salary', 'Department ID'
  ];

  employeeKeys = [
    'id', 'name', 'email', 'salary', 'departmentId'
  ];

  studentColumns = [
    'ID', 'Name', 'Email', 'Course'
  ];

  studentKeys = [
    'id', 'name', 'email', 'course'
  ];

  employeeForm: FormGroup;
  studentForm: FormGroup;
  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private studentService: StudentService,
    private departmentService: DepartmentService
  ) {

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      salary: [null, [Validators.required, Validators.min(1)]],
      departmentId: [null, [Validators.required, Validators.min(1)]]
    });

    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      course: ['', Validators.required]
    });

    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.role = this.route.snapshot.data['role'] || 'Admin';

    if (this.role === 'Admin' || this.role === 'Employee') {
      this.loadEmployees();
    }

    if (this.role === 'Admin' || this.role === 'Student') {
      this.loadStudents();
    }

    if (this.role === 'Admin') {
      this.loadDepartments();
    }
  }

  // EMPLOYEE OPERATIONS

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        this.employees = response.content || response;
        this.errorMessage = '';
      },
      error: error => {
        this.errorMessage = 'Unable to load employees.';
        console.error(error);
      }
    });
  }

  openEmployeeForm(): void {
    if (this.role !== 'Admin') return;

    // Close if Add Employee form is already open
    if (this.showEmployeeForm && this.editingEmployeeId === null) {
      this.showEmployeeForm = false;
      this.employeeForm.reset();
      return;
    }

    this.showEmployeeForm = true;
    this.editingEmployeeId = null;
    this.employeeForm.reset();
    this.showStudentForm = false;
    this.showDepartmentForm = false;
    this.errorMessage = '';
  }

  saveEmployee(): void {
    if (this.role !== 'Employee' && this.role !== 'Admin') return;

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employee = this.employeeForm.value;

    const request = this.editingEmployeeId
      ? this.employeeService.updateEmployee(this.editingEmployeeId, employee)
      : this.employeeService.addEmployee(employee);

    request.subscribe({
      next: () => {
        this.closeForms();
        this.loadEmployees();
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to save employee.';
        console.error(error);
      }
    });
  }

  editEmployee(employee: any): void {
    if (this.role !== 'Admin') return;

    // Close if the same employee's Edit form is already open
    if (
      this.showEmployeeForm &&
      this.editingEmployeeId === employee.id
    ) {
      this.showEmployeeForm = false;
      this.editingEmployeeId = null;
      this.employeeForm.reset();
      return;
    }

    this.showEmployeeForm = true;
    this.editingEmployeeId = employee.id;
    this.employeeForm.patchValue(employee);
    this.showStudentForm = false;
    this.showDepartmentForm = false;
    this.errorMessage = '';
  }

  deleteEmployee(id: number): void {
    if (this.role !== 'Admin') return;

    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: error => {
        this.errorMessage = 'Unable to delete employee.';
        console.error(error);
      }
    });
  }

  // STUDENT OPERATIONS

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (response: any) => {
        this.students = response.content || response;
        this.errorMessage = '';
      },
      error: error => {
        this.errorMessage = 'Unable to load students.';
        console.error(error);
      }
    });
  }

  openStudentForm(): void {
    if (this.role !== 'Admin') return;

    // Close if Add Student form is already open
    if (this.showStudentForm && this.editingStudentId === null) {
      this.showStudentForm = false;
      this.studentForm.reset();
      return;
    }

    this.showStudentForm = true;
    this.editingStudentId = null;
    this.studentForm.reset();
    this.showEmployeeForm = false;
    this.showDepartmentForm = false;
    this.errorMessage = '';
  }

  saveStudent(): void {
    if (this.role !== 'Admin') return;

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const student = this.studentForm.value;

    const request = this.editingStudentId
      ? this.studentService.updateStudent(this.editingStudentId, student)
      : this.studentService.addStudent(student);

    request.subscribe({
      next: () => {
        this.closeForms();
        this.loadStudents();
      },
      error: error => {
        this.errorMessage =
          error.error?.message || 'Unable to save student.';
        console.error(error);
      }
    });
  }

  editStudent(student: any): void {
    if (this.role !== 'Admin') return;

    // Close if the same student's Edit form is already open
    if (
      this.showStudentForm &&
      this.editingStudentId === student.id
    ) {
      this.showStudentForm = false;
      this.editingStudentId = null;
      this.studentForm.reset();
      return;
    }

    this.showStudentForm = true;
    this.editingStudentId = student.id;
    this.studentForm.patchValue(student);
    this.showEmployeeForm = false;
    this.showDepartmentForm = false;
    this.errorMessage = '';
  }

  deleteStudent(id: number): void {
    if (this.role !== 'Admin') return;

    if (!confirm('Are you sure you want to delete this student?')) return;

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: error => {
        this.errorMessage = 'Unable to delete student.';
        console.error(error);
      }
    });
  }

  // DEPARTMENT OPERATIONS

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response: any) => {
        // Handle normal array or paginated API response
        const departmentList = Array.isArray(response)
          ? response
          : response.content || [];

        // Sort department IDs in ascending order numerically
        this.departments = [...departmentList].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );

        console.log('Sorted Departments:', this.departments);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Unable to load departments.';
        console.error(error);
      }
    });
  }

  openDepartmentForm(): void {
    if (this.role !== 'Admin') return;

    // Close if Add Department form is already open
    if (
      this.showDepartmentForm &&
      this.editingDepartmentId === null
    ) {
      this.showDepartmentForm = false;
      this.departmentForm.reset();
      return;
    }

    this.showDepartmentForm = true;
    this.editingDepartmentId = null;
    this.departmentForm.reset();
    this.showEmployeeForm = false;
    this.showStudentForm = false;
    this.errorMessage = '';
  }

  editDepartment(department: Department): void {
    if (this.role !== 'Admin') return;

    // Close if the same department's Edit form is already open
    if (
      this.showDepartmentForm &&
      this.editingDepartmentId === department.id
    ) {
      this.showDepartmentForm = false;
      this.editingDepartmentId = null;
      this.departmentForm.reset();
      return;
    }

    this.showDepartmentForm = true;
    this.editingDepartmentId = department.id;
    this.departmentForm.patchValue({
      departmentName: department.departmentName
    });
    this.showEmployeeForm = false;
    this.showStudentForm = false;
    this.errorMessage = '';
  }

  saveDepartment(): void {
    if (this.role !== 'Admin') return;

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const department: DepartmentRequest = this.departmentForm.value;

    const request = this.editingDepartmentId
      ? this.departmentService.updateDepartment(
        this.editingDepartmentId,
        department
      )
      : this.departmentService.addDepartment(department);

    request.subscribe({
      next: () => {
        this.closeForms();
        this.loadDepartments();
      },
      error: error => {
        this.errorMessage =
          error.error?.error || 'Unable to save department.';
        console.error(error);
      }
    });
  }

  deleteDepartment(id: number): void {
    if (this.role !== 'Admin') return;

    if (!confirm('Are you sure you want to delete this department?')) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => this.loadDepartments(),
      error: error => {
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to delete department. It may contain employees.';
        console.error(error);
      }
    });
  }

  viewDepartmentEmployees(id: number): void {
    if (this.role !== 'Admin') return;

    this.departmentService.getDepartmentEmployees(id).subscribe({
      next: data => {
        this.departmentEmployees = data;
        this.showDepartmentEmployees = true;
        this.errorMessage = '';
      },
      error: error => {
        this.errorMessage = 'Unable to load department employees.';
        console.error(error);
      }
    });
  }

  closeDepartmentEmployees(): void {
    this.showDepartmentEmployees = false;
    this.departmentEmployees = [];
  }

  // CLOSE FORMS

  closeForms(): void {
    this.showEmployeeForm = false;
    this.showStudentForm = false;
    this.showDepartmentForm = false;

    this.editingEmployeeId = null;
    this.editingStudentId = null;
    this.editingDepartmentId = null;

    this.employeeForm.reset();
    this.studentForm.reset();
    this.departmentForm.reset();

    this.errorMessage = '';
  }
}
