import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

// Pantalla provisoria: confirma que la sesión funciona.
// Acá se van a sumar Horarios, Reservas y Usuarios.
@Component({
  selector: 'app-home',
  template: `
    <div class="shell">
      <header>
        <p class="wordmark">SpotOn</p>
        <button class="btn-quiet" type="button" (click)="logout()">Cerrar sesión</button>
      </header>

      @if (auth.session(); as session) {
        <main class="home">
          <h1>Hola, {{ session.email }}</h1>
          <p>
            Tu rol es {{ session.role === 'ADMIN' ? 'administrador' : 'usuario' }}.
            Acá van a aparecer los horarios y tus reservas.
          </p>
        </main>
      }
    </div>
  `,
})
export class HomeComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
