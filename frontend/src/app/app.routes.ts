import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

// Las pantallas con sesión iniciada son rutas hijas de AppShellComponent,
// que dibuja el encabezado con el menú. Para sumar una sección nueva,
// agregá una ruta hija acá y un link en app-shell.component.ts.
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'reservas',
        loadComponent: () => import('./pages/bookings.component').then((m) => m.BookingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
