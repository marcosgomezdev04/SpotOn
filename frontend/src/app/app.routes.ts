import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

// Cuando sumes user, booking o schedule, agregá sus rutas acá con canActivate: [authGuard].
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: '' },
];
