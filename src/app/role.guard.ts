import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROLE } from './services/auth/auth.type';
import { AuthService } from './services/auth/auth.service';

const authRoutes: string[] = ['/login', '/register'];

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const activePath = `/${route.url[0].path}`;

  const authState = authService.getAuthState();

  const requiredRole = route.data['role'];

  if(!authState && (requiredRole || requiredRole?.length)) {
    router.navigate(['/']);
    return false;
  }

  if (authState && authRoutes.includes(activePath) && authState['id']) {
    router.navigate(['/']);
    return false;
  }

  if (authState && authState['expired'] < Date.now()) {
    router.navigate(['/']);
    authService.logout();
    return false;
  }

  if (authState && !Array.isArray(requiredRole) && authState['role'] !== requiredRole) {
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(authState['role']);
    router.navigate([isAdmin ? '/admin/dashboard' : '/']);
    return false;
  }

  if (authState && Array.isArray(requiredRole) && !requiredRole.includes(authState['role'])) {
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(authState['role']);
    router.navigate([isAdmin ? '/admin/dashboard' : '/']);
    return false;
  }

  return true;
};
