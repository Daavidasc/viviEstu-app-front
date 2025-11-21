// auth/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // Obtenemos el token usando el signal
  const authToken = authService.token();

  // URL donde no queremos añadir el token (ej: login, register, estáticos)
  const isExcludedUrl = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (authToken && !isExcludedUrl) {
    // Clona la petición y añade el header de Authorization
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Petición original si no hay token o si es una URL excluida
  return next(req);
};
