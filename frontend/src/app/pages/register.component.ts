import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AuthLayoutComponent } from '../components/auth-layout.component';
import { FieldComponent } from '../components/field.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, FieldComponent],
  template: `
    <app-auth-layout
      heading="Creá tu cuenta"
      lead="Con tu cuenta podés reservar canchas en pocos pasos."
    >
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }

        <app-field inputId="name" label="Nombre" autofill="name" [control]="form.controls.name" />
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
          autofill="new-password"
          hint="Mínimo 8 caracteres."
          [control]="form.controls.password"
        />

        <button class="btn" type="submit" [disabled]="loading()">
          {{ loading() ? 'Creando cuenta…' : 'Crear cuenta' }}
        </button>
      </form>

      <span footer>¿Ya tenés cuenta? <a routerLink="/login">Ingresar</a></span>
    </app-auth-layout>
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
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

    const { name, email, password } = this.form.getRawValue();

    this.auth.register(name.trim(), email.trim(), password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
