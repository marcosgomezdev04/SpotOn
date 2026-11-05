import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

// Encabezado compartido de las pantallas con sesión iniciada.
// Cuando se sume una sección nueva (por ejemplo Usuarios), se agrega un link acá
// y una ruta hija en app.routes.ts.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogComponent],
  template: `
    <div class="bar">
      <header class="app-header">
        <strong class="brand">MatchDay</strong>

        <nav aria-label="Secciones">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Horarios
          </a>
          @if (!isAdmin()) {
            <a routerLink="/reservas" routerLinkActive="active">Mis reservas</a>
          }
          @if (isAdmin()) {
            <a routerLink="/usuarios" routerLinkActive="active">Usuarios</a>
          }
        </nav>

        <div class="account">
          @if (auth.session(); as session) {
            <span class="email">{{ session.email }}</span>

            @if (session.role === 'ADMIN') {
              <span class="admin-label">Administrador</span>
            }
          }

          <button type="button" (click)="logout()">Cerrar sesión</button>
        </div>
      </header>
    </div>

    <router-outlet />
    <app-confirm-dialog />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      color: #18212f;
      background-color: #eef4f0;
      /* Cancha de fondo: líneas suaves + degradado verde */
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='340' viewBox='0 0 520 340' fill='none' stroke='%23166534' stroke-opacity='0.09' stroke-width='3'%3E%3Crect x='10' y='10' width='500' height='320' rx='6'/%3E%3Cpath d='M260 10v320'/%3E%3Ccircle cx='260' cy='170' r='48'/%3E%3Crect x='10' y='95' width='80' height='150'/%3E%3Crect x='430' y='95' width='80' height='150'/%3E%3C/svg%3E"),
        radial-gradient(900px 500px at 100% 0%, rgba(22, 101, 52, 0.14), transparent 70%),
        radial-gradient(800px 500px at 0% 100%, rgba(255, 201, 51, 0.16), transparent 70%);
      background-repeat: repeat, no-repeat, no-repeat;
      background-attachment: fixed;
    }

    .bar {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 24px 0;
    }

    .app-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid #dce2e8;
    }

    .brand {
      font-size: 26px;
    }

    nav {
      display: flex;
      gap: 6px;
    }

    nav a {
      padding: 8px 14px;
      border-radius: 8px;
      color: #18212f;
      font-weight: 600;
      text-decoration: none;
    }

    nav a:hover {
      background: #e6ecea;
    }

    nav a.active {
      background: #dcfce7;
      color: #166534;
    }

    .account {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-left: auto;
    }

    .email {
      overflow-wrap: anywhere;
    }

    .admin-label {
      padding: 4px 8px;
      border-radius: 6px;
      background: #e0e7ff;
      color: #3730a3;
      font-size: 12px;
    }

    button {
      padding: 10px 16px;
      border: 1px solid #bac5ce;
      border-radius: 8px;
      background: white;
      color: #18212f;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    a:focus-visible,
    button:focus-visible {
      outline: 3px solid #86b7fe;
      outline-offset: 2px;
    }

    @media (max-width: 480px) {
      .bar {
        padding: 16px 16px 0;
      }

      .account {
        margin-left: 0;
      }
    }
  `,
})
export class AppShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isAdmin = computed(
    () => this.auth.session()?.role === 'ADMIN'
  );

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
