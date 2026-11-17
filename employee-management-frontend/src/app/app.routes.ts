
import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Employees } from './pages/employees/employees';
import { Departments } from './pages/departments/departments';
import { RolePageComponent } from './role-page/role-page.component';
import { LoginComponent } from './pages/login/login';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Employee', 'Student'] }
  },

  {
    path: 'admin',
    component: RolePageComponent,
    canActivate: [authGuard],
    data: { role: 'Admin', roles: ['Admin'] }
  },

  {
    path: 'employee',
    component: RolePageComponent,
    canActivate: [authGuard],
    data: { role: 'Employee', roles: ['Employee'] }
  },

  {
    path: 'student',
    component: RolePageComponent,
    canActivate: [authGuard],
    data: { role: 'Student', roles: ['Student'] }
  },

  {
    path: 'students',
    component: RolePageComponent,
    canActivate: [authGuard],
    data: { role: 'Admin', roles: ['Admin', 'Employee', 'Student'] }
  },

  {
    path: 'employees',
    component: Employees,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Employee'] }
  },

  {
    path: 'departments',
    component: Departments,
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
