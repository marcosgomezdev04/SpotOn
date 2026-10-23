import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { User, UserService } from '../core/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['../../styles/users.css'],
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

  protected readonly users = signal<User[]>([]);
  protected readonly selected = signal<User | null>(null);
  protected readonly editing = signal(false);
  protected readonly loading = signal(false);
  protected readonly working = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly search = signal('');

  protected readonly isAdmin = computed(
    () => this.auth.session()?.role === 'ADMIN'
  );

  protected readonly busy = computed(
    () => this.loading() || this.working()
  );

  protected readonly filteredUsers = computed(() => {
    const query = this.search().trim().toLowerCase();

    return this.users().filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(query)
    );
  });

  protected draft = {
    name: '',
    email: '',
  };

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.load();
    }
  }

  protected load(): void {
    if (this.busy() || !this.isAdmin()) return;

    this.loading.set(true);
    this.error.set('');

    this.userService.getUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => this.users.set(users),
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected open(user: User, edit: boolean): void {
    if (this.busy()) return;

    this.error.set('');
    this.success.set('');
    this.selected.set(null);
    this.working.set(true);

    // Consultamos el detalle para obtener los datos actuales del usuario.
    this.userService.getUserById(user._id)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: (current) => {
          this.selected.set(current);
          this.editing.set(edit);
          this.draft = {
            name: current.name,
            email: current.email,
          };
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected close(): void {
    if (this.busy()) return;

    this.selected.set(null);
    this.editing.set(false);
  }

  protected save(form: NgForm): void {
    const user = this.selected();

    if (!user || this.busy() || !this.isAdmin()) return;

    if (form.invalid || !this.draft.name.trim()) {
      form.control.markAllAsTouched();
      this.error.set('Completá el nombre y un correo válido.');
      return;
    }

    const data = {
      name: this.draft.name.trim(),
      email: this.draft.email.trim(),
    };

    this.error.set('');
    this.success.set('');
    this.working.set(true);

    this.userService.updateUser(user._id, data)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: (updated) => {
          this.users.update((users) =>
            users.map((item) =>
              item._id === updated._id ? updated : item
            )
          );

          this.selected.set(updated);
          this.editing.set(false);

          const ownAccount = updated._id === this.auth.session()?.id;

          this.success.set(
            ownAccount
              ? 'Datos guardados. Si cambiaste tu correo, volvé a iniciar sesión para actualizar el encabezado.'
              : 'Usuario actualizado correctamente.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  private messageFor(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No pudimos conectar con el servidor.';
      case 400:
        return 'No se pudieron guardar los datos. Revisá el nombre y el correo; el correo podría estar en uso.';
      case 401:
        return 'Tu sesión venció. Volvé a iniciar sesión.';
      case 403:
        return 'No tenés permiso para realizar esta operación.';
      case 404:
        return 'El usuario ya no existe. Actualizá la lista.';
      case 409:
        return 'Los datos entran en conflicto con otro registro.';
      default:
        return 'No se pudo completar la operación. Actualizá la lista antes de reintentar.';
    }
  }
} 