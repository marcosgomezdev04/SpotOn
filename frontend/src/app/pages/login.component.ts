import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AuthLayoutComponent } from '../components/auth-layout.component';
import { FieldComponent } from '../components/field.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, FieldComponent],
  template: `
    <app-auth-layout
      heading="Ingresá a tu cuenta"
      lead="Entrá para ver horarios y manejar tus reservas."
    >
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }

        <app-field
          inputId="email"
          kind="email"
          label="Email"
          autofill="email"
          [control]="form.controls.email"
        />
        <app-field
          inputId="password"
          kind="password"
          label="Contraseña"
          autofill="current-password"
          [control]="form.controls.password"
        />

        <button class="btn" type="submit" [disabled]="loading()">
          {{ loading() ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>

      <span footer>¿Todavía no tenés cuenta? <a routerLink="/register">Crear cuenta</a></span>
    </app-auth-layout>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email.trim(), password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/');
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
