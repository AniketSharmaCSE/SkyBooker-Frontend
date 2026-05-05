import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string | string[]): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const userRole = auth.getRole();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};
