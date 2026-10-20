import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { errorMessage } from './api-error';

export type Role = 'USER' | 'ADMIN';

export interface Session {
  token: string;
  id: string;
  email: string;
  role: Role;
  expiresAt: number;
}

const STORAGE_KEY = 'spoton_token';
const API = '/api';

// El backend firma el JWT con { id, email, role } y vence a las 24 h.
function readSession(token: string | null): Session | null {
  if (!token) return null;

  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part.padEnd(Math.ceil(part.length / 4) * 4, '='))) as {
      id?: string;
      email?: string;
      role?: string;
      exp?: number;
    };
    const expiresAt = Number(payload.exp) * 1000;

    if (!payload.id || !payload.email || !(expiresAt > Date.now())) return null;

    return {
      token,
      id: payload.id,
      email: payload.email,
      role: payload.role === 'ADMIN' ? 'ADMIN' : 'USER',
      expiresAt,
    };
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly token = signal<string | null>(localStorage.getItem(STORAGE_KEY));
  private timer?: ReturnType<typeof setTimeout>;

  readonly session = computed(() => readSession(this.token()));
  readonly isLoggedIn = computed(() => this.session() !== null);

  constructor() {
    // Token inválido o vencido guardado de antes: se descarta
    if (this.token() && !this.session()) this.logout();
    this.scheduleExpiry();
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${API}/auth/login`, { email, password }).pipe(
      tap(({ token }) => this.saveToken(token)),
      map(() => undefined),
      catchError((err) =>
        throwError(() => new Error(errorMessage(err, { 401: 'Email o contraseña incorrectos.' }))),
      ),
    );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post(`${API}/auth/register`, { name, email, password }).pipe(
      catchError((err) =>
        throwError(
          () => new Error(errorMessage(err, { 409: 'Ese email ya tiene una cuenta. Probá ingresar.' })),
        ),
      ),
      // El registro no devuelve token, así que se inicia sesión directo
      switchMap(() => this.login(email, password)),
    );
  }

  logout(): void {
    clearTimeout(this.timer);
    localStorage.removeItem(STORAGE_KEY);
    this.token.set(null);
  }

  private saveToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
    this.token.set(token);
    this.scheduleExpiry();
  }

  // Cierra la sesión sola cuando vence el token
  private scheduleExpiry(): void {
    clearTimeout(this.timer);
    const session = this.session();
    if (!session) return;

    this.timer = setTimeout(
      () => {
        this.logout();
        this.router.navigateByUrl('/login');
      },
      Math.min(session.expiresAt - Date.now(), 2 ** 31 - 1),
    );
  }
}
