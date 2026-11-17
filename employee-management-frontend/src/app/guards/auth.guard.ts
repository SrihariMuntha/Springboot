
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Check login
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Get logged-in user's role
  const userRole = (authService.getRole() || '').trim().toLowerCase();

  // Get roles allowed for this route
  const allowedRoles = route.data['roles'] as string[] | undefined;

  // Check role permission
  if (
    allowedRoles &&
    !allowedRoles.some(role => role.trim().toLowerCase() === userRole)
  ) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
