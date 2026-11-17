
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { DepartmentService } from '../../services/department';
import { Department, DepartmentRequest } from '../../models/department';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class Departments implements OnInit {

  departments: Department[] = [];
  employees: Employee[] = [];

  showForm = false;
  editMode = false;
  selectedId = 0;
  showEmployees = false;
  errorMessage = '';

  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load departments.';
      }
    });
  }

  openAddForm(): void {
    if (this.showForm && !this.editMode) {
      this.closeForm();
      return;
    }

    this.showForm = true;
    this.editMode = false;
    this.selectedId = 0;
    this.errorMessage = '';

    this.departmentForm.reset({
      departmentName: ''
    });
  }

  editDepartment(dept: Department): void {
    if (
      this.showForm &&
      this.editMode &&
      this.selectedId === dept.id
    ) {
      this.closeForm();
      return;
    }

    this.showForm = true;
    this.editMode = true;
    this.selectedId = dept.id;
    this.errorMessage = '';

    this.departmentForm.patchValue({
      departmentName: dept.departmentName
    });
  }

  saveDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const department: DepartmentRequest = this.departmentForm.value;

    if (this.editMode) {
      this.departmentService.updateDepartment(
        this.selectedId,
        department
      ).subscribe({
        next: () => {
          this.closeForm();
          this.loadDepartments();
        },
        error: (error) => {
          this.errorMessage =
            error.error?.error || 'Unable to update department.';
        }
      });
    } else {
      this.departmentService.addDepartment(department).subscribe({
        next: () => {
          this.closeForm();
          this.loadDepartments();
        },
        error: (error) => {
          this.errorMessage =
            error.error?.error || 'Unable to add department.';
        }
      });
    }
  }

  deleteDepartment(id: number): void {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => this.loadDepartments(),
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Unable to delete department. It may contain employees.';
      }
    });
  }

  viewEmployees(id: number): void {
    this.departmentService.getDepartmentEmployees(id).subscribe({
      next: (data) => {
        this.employees = data;
        this.showEmployees = true;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to load department employees.';
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.selectedId = 0;
    this.errorMessage = '';

    this.departmentForm.reset({
      departmentName: ''
    });
  }

  closeEmployees(): void {
    this.showEmployees = false;
    this.employees = [];
  }
}

export class DepartmentsComponent {
}
