// auth/guards/auth.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleType } from '../models/user.model'; // Asegúrate de importar RoleType

/**
 * Guard para proteger rutas y verificar roles.
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar Autenticación
  if (!authService.isAuthenticated()) {
    console.log('Acceso denegado: No autenticado.');
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Control de Roles (RBAC)
  // Obtener los roles requeridos de la configuración de la ruta (data: { roles: [...] })
  const requiredRoles = route.data['roles'] as RoleType[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authService.currentUser()?.role;

    if (!userRole) {
      console.log('Acceso denegado: Rol de usuario no disponible.');
      // Opcional: Cerrar sesión si el token existe pero el rol no
      authService.logout();
      return false;
    }

    // Verificar si el rol del usuario está en la lista de roles requeridos
    if (!requiredRoles.includes(userRole)) {
      console.log('Acceso denegado: Rol insuficiente.', { required: requiredRoles, user: userRole });
      // Redirigir a una página de "acceso denegado"
      router.navigate(['/access-denied']); // <-- AJUSTA ESTA RUTA
      return false;
    }
  }

  // Si pasa la autenticación y los roles (si aplican)
  return true;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true; // Permitir acceso a login/register
  }

  // Usuario ya autenticado - redirigir según su rol
  const userRole = authService.currentUser()?.role;

  console.log('Usuario autenticado intentando acceder a ruta pública, redirigiendo:', userRole);

  switch (userRole) {
    case RoleType.ROLE_ESTUDIANTE:
      router.navigate(['/student/dashboard']);
      break;

    case RoleType.ROLE_PROPIETARIO:
      router.navigate(['/landlord/dashboard']);
      break;

    case RoleType.ROLE_ADMIN:
      router.navigate(['/admin/dashboard']);
      break;

    default:
      // Si no tiene rol válido, cerrar sesión y permitir acceso
      console.warn('Rol no válido, cerrando sesión');
      authService.logout();
      return true;
  }

  return false; // Bloquear acceso porque ya redirigió
};
