// role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'] as string; // Obtenemos el rol requerido desde las rutas
  const userRole = authService.getRole(); // Obtenemos el rol del usuario autenticado

  if (authService.isAuthenticated() && userRole === requiredRole) {
    return true; // El usuario tiene el rol requerido
  } else {
    console.warn('Acceso denegado: rol no permitido o usuario no autenticado');
    return router.parseUrl('/login'); // Redirige a login si no tiene el rol adecuado
  }
};
