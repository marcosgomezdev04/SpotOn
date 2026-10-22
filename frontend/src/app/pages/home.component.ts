import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { BookingService } from '../core/booking.service';
import {
  CreateScheduleData,
  Schedule,
  ScheduleService,
} from '../core/schedule.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/home.css'],
})
export class HomeComponent implements OnInit {
  protected readonly auth = inject(AuthService);

  private readonly scheduleService = inject(ScheduleService);
  private readonly bookingService = inject(BookingService);

  protected readonly fields = [
    'Cancha 1',
    'Cancha 2',
    'Cancha 3',
    'Cancha 4',
    'Cancha 5',
  ];

  protected readonly schedules = signal<Schedule[]>([]);
  protected readonly selected = signal<Schedule | null>(null);
  protected readonly editingId = signal<string | null>(null);

  protected readonly loading = signal(false);
  protected readonly working = signal(false);

  protected readonly error = signal('');
  protected readonly formError = signal('');
  protected readonly success = signal('');

  protected readonly filterField = signal('');
  protected readonly filterDate = signal('');
  protected readonly filterStatus = signal('');

  protected readonly isAdmin = computed(
    () => this.auth.session()?.role === 'ADMIN'
  );

  protected readonly busy = computed(
    () => this.loading() || this.working()
  );

  protected readonly filteredSchedules = computed(() => {
    const field = this.filterField();
    const date = this.filterDate();
    const status = this.filterStatus();

    return this.schedules()
      .filter((schedule) =>
        (!field || schedule.fieldName === field) &&
        (!date || schedule.date?.slice(0, 10) === date) &&
        (!status || schedule.status === status)
      )
      .sort((a, b) =>
        `${a.date ?? ''} ${a.startTime ?? ''}`.localeCompare(
          `${b.date ?? ''} ${b.startTime ?? ''}`
        )
      );
  });

  protected draft: CreateScheduleData = this.emptyDraft();

  protected get today(): string {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  private emptyDraft(): CreateScheduleData {
    return {
      fieldName: 'Cancha 1',
      date: '',
      startTime: '',
      endTime: '',
    };
  }

  protected clearFilters(): void {
    this.filterField.set('');
    this.filterDate.set('');
    this.filterStatus.set('');
  }

  protected loadSchedules(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');

    this.scheduleService.getSchedules()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (schedules) => this.schedules.set(schedules),
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected showDetails(id: string): void {
    if (this.busy()) return;

    this.selected.set(null);
    this.error.set('');
    this.working.set(true);

    this.scheduleService.getScheduleById(id)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: (schedule) => this.selected.set(schedule),
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected closeDetails(): void {
    this.selected.set(null);
  }

  protected startEdit(schedule: Schedule): void {
    if (
      !this.isAdmin() ||
      this.busy() ||
      schedule.status === 'BOOKED'
    ) {
      return;
    }

    this.editingId.set(schedule._id);
    this.formError.set('');
    this.error.set('');
    this.success.set('');

    this.draft = {
      fieldName: schedule.fieldName || '',
      date: schedule.date?.slice(0, 10) || '',
      startTime: this.validTime(schedule.startTime)
        ? schedule.startTime
        : '',
      endTime: this.validTime(schedule.endTime)
        ? schedule.endTime
        : '',
    };

    document.getElementById('schedule-editor')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected cancelEdit(form: NgForm): void {
    this.editingId.set(null);
    this.formError.set('');
    this.draft = this.emptyDraft();
    form.resetForm(this.draft);
  }

  protected saveSchedule(form: NgForm): void {
    if (!this.isAdmin() || this.busy()) return;

    this.formError.set('');
    this.error.set('');
    this.success.set('');

    const data = { ...this.draft };

    if (
      form.invalid ||
      !this.fields.includes(data.fieldName) ||
      !data.date ||
      !this.validTime(data.startTime) ||
      !this.validTime(data.endTime)
    ) {
      this.formError.set('Completá todos los campos correctamente.');
      return;
    }

    if (data.startTime >= data.endTime) {
      this.formError.set(
        'La hora de fin debe ser posterior a la hora de inicio.'
      );
      return;
    }

    const start = new Date(`${data.date}T${data.startTime}:00`);

    if (
      !Number.isFinite(start.getTime()) ||
      start.getTime() <= Date.now()
    ) {
      this.formError.set('Elegí una fecha y una hora futuras.');
      return;
    }

    const id = this.editingId();

    const request = id
      ? this.scheduleService.updateSchedule(id, data)
      : this.scheduleService.createSchedule(data);

    this.working.set(true);

    request
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: (saved) => {
          this.schedules.update((items) =>
            id
              ? items.map((item) => item._id === id ? saved : item)
              : [...items, saved]
          );

          if (this.selected()?._id === saved._id) {
            this.selected.set(saved);
          }

          this.cancelEdit(form);
          this.clearFilters();
          this.success.set(
            id
              ? 'Horario actualizado correctamente.'
              : 'Horario creado correctamente.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.formError.set(this.messageFor(error));
        },
      });
  }

  protected removeSchedule(schedule: Schedule): void {
    if (
      !this.isAdmin() ||
      this.busy() ||
      schedule.status === 'BOOKED'
    ) {
      return;
    }

    const confirmed = window.confirm(
      `¿Eliminar el horario de ${schedule.fieldName || 'esta cancha'} ` +
      `del ${this.formatDate(schedule.date)} ` +
      `de ${schedule.startTime} a ${schedule.endTime}?`
    );

    if (!confirmed) return;

    this.error.set('');
    this.success.set('');
    this.working.set(true);

    this.scheduleService.deleteSchedule(schedule._id)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: () => {
          this.schedules.update((items) =>
            items.filter((item) => item._id !== schedule._id)
          );

          if (this.selected()?._id === schedule._id) {
            this.selected.set(null);
          }

          if (this.editingId() === schedule._id) {
            this.editingId.set(null);
            this.draft = this.emptyDraft();
          }

          this.success.set('Horario eliminado correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  private validTime(value: string): boolean {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '');
  }

  protected isFutureSchedule(schedule: Schedule): boolean {
    if (
      !schedule.fieldName ||
      !schedule.date ||
      !this.validTime(schedule.startTime) ||
      !this.validTime(schedule.endTime)
    ) {
      return false;
    }

    const start = new Date(
      `${schedule.date.slice(0, 10)}T${schedule.startTime}:00`
    );

    return (
      Number.isFinite(start.getTime()) &&
      start.getTime() > Date.now()
    );
  }

  protected reserve(schedule: Schedule): void {
    if (
      this.busy() ||
      schedule.status !== 'AVAILABLE' ||
      !this.isFutureSchedule(schedule)
    ) {
      return;
    }

    const confirmed = window.confirm(
      `¿Reservar ${schedule.fieldName} ` +
      `el ${this.formatDate(schedule.date)} ` +
      `de ${schedule.startTime} a ${schedule.endTime}?`
    );

    if (!confirmed) return;

    this.error.set('');
    this.success.set('');
    this.working.set(true);

    this.bookingService.createBooking(schedule._id)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: () => {
          this.schedules.update((items) =>
            items.map((item) =>
              item._id === schedule._id
                ? { ...item, status: 'BOOKED' as const }
                : item
            )
          );

          const detail = this.selected();

          if (detail?._id === schedule._id) {
            this.selected.set({ ...detail, status: 'BOOKED' });
          }

          this.success.set('¡Reserva confirmada!');
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(
            error.status === 400 || error.status === 409
              ? 'No se pudo reservar. Actualizá la lista: el horario puede estar ocupado o ya tener una reserva tuya.'
              : this.messageFor(error)
          );
        },
      });
  }

  private formatDate(value: string): string {
    if (!value) return 'fecha desconocida';

    const [year, month, day] = value.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }

  private messageFor(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No pudimos conectar con el servidor.';
      case 401:
        return 'Tu sesión venció. Volvé a iniciar sesión.';
      case 403:
        return 'No tenés permiso para realizar esta acción.';
      case 404:
        return 'El horario ya no existe. Actualizá la lista.';
      case 400:
      case 409:
        return 'No se pudo completar la operación. Revisá los datos y que el horario no se superponga con otro de la misma cancha.';
      default:
        return 'El servidor no pudo completar la operación. Actualizá la lista antes de reintentar.';
    }
  }
} 