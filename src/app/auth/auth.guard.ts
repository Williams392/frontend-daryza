import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    if (authService.isAuthenticated()) {
        return true; // Usuario autenticado
    } else {
        console.warn('Usuario no autenticado, redirigiendo a login');
        return router.parseUrl('/login'); // Redirige a login si no está autenticado
    }
      
};
