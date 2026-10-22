import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

// Encabezado compartido de las pantallas con sesión iniciada.
// Cuando se sume una sección nueva (por ejemplo Usuarios), se agrega un link acá
// y una ruta hija en app.routes.ts.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="bar">
      <header class="app-header">
        <strong class="brand">SpotOn</strong>

        <nav aria-label="Secciones">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Horarios
          </a>
          <a routerLink="/reservas" routerLinkActive="active">Mis reservas</a>
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
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #f4f7f6;
      color: #18212f;
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

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
