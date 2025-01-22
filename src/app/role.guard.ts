import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROLE } from './services/authService/index.type';
import { AuthService } from './services/authService/index.service';

const authRoutes: string[] = ['/login', '/register'];

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const activePath = `/${route.url[0].path}`;

  const authState = authService.getAuthState();

  if(authState && authRoutes.includes(activePath) && authState['id']) {
    router.navigate(['/'])
    return false
  }
  
  if(authState && authState['expired'] < Date.now()) {
    router.navigate(['/'])
    authService.logout()
    return false;
  }

  if(authState && authState['role'] !== ROLE.ADMIN) {
    router.navigate(['/'])
    return false;
  }

  // if(route.data['role'] !== ROLE.ADMIN && authState['role'] !== ROLE.ADMIN) {
  //   router.navigate(['/'])
  //   return false
  // }

  // if(route.data['role'] !== ROLE.USER) {
  //   router.navigate(['/'])
  //   return false
  // }

  return true;
};
