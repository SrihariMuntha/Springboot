
import { Injectable } from '@angular/core';

export type UserRole = 'Admin' | 'Employee' | 'Student';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginKey = 'ems_logged_in';
  private readonly roleKey = 'ems_user_role';

  login(role: UserRole): void {
    localStorage.setItem(this.loginKey, 'true');
    localStorage.setItem(this.roleKey, role);
  }

  logout(): void {
    localStorage.removeItem(this.loginKey);
    localStorage.removeItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loginKey) === 'true';
  }

  getRole(): UserRole | null {
    return localStorage.getItem(this.roleKey) as UserRole | null;
  }
}
