
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AuthService,
  UserRole
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">

      <div class="login-card">

        <h2>EMS Login</h2>
        <p>Employee Management System</p>

        <label>Select Role</label>

        <select
          [value]="selectedRole"
          (change)="selectedRole = $any($event.target).value">
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
          <option value="Student">Student</option>
        </select>

        <button (click)="login()">
          Login
        </button>

      </div>

    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f4f6;
    }

    .login-card {
      width: 320px;
      padding: 30px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    h2, p {
      text-align: center;
    }

    label {
      display: block;
      margin-top: 20px;
    }

    select, button {
      width: 100%;
      padding: 12px;
      margin-top: 10px;
      box-sizing: border-box;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
  `]
})
export class LoginComponent {

  selectedRole: UserRole = 'Admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {

    this.authService.login(this.selectedRole);

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    if (this.selectedRole === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (this.selectedRole === 'Employee') {
      this.router.navigate(['/employee']);
    } else {
      this.router.navigate(['/student']);
    }
  }
}
