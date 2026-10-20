import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Agrega el token a todas las llamadas al backend (/api/...) cuando hay sesión.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).session()?.token;

  if (token && req.url.startsWith('/api')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
