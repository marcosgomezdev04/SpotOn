import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { Booking, BookingService } from '../core/booking.service';
import { Schedule, ScheduleService } from '../core/schedule.service';

// Una reserva junto con los datos de su horario.
// "schedule" es null si el horario fue eliminado después de reservar.
interface BookingView {
  booking: Booking;
  schedule: Schedule | null;
  upcoming: boolean;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './bookings.component.html',
  styleUrls: ['../../styles/home.css', '../../styles/bookings.css'],
})
export class BookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly scheduleService = inject(ScheduleService);

  protected readonly bookings = signal<Booking[]>([]);
  private readonly schedules = signal<Schedule[]>([]);

  protected readonly loading = signal(false);
  protected readonly working = signal(false);

  protected readonly error = signal('');
  protected readonly success = signal('');

  protected readonly busy = computed(
    () => this.loading() || this.working()
  );

  private readonly views = computed<BookingView[]>(() => {
    const byId = new Map(
      this.schedules().map((schedule) => [schedule._id, schedule])
    );

    return this.bookings().map((booking) => {
      const schedule = byId.get(booking.scheduleId) ?? null;

      return {
        booking,
        schedule,
        upcoming:
          booking.status === 'CONFIRMED' &&
          schedule !== null &&
          this.startOf(schedule) > Date.now(),
      };
    });
  });

  // Reservas confirmadas que todavía no ocurrieron: lo más cercano primero
  protected readonly upcoming = computed(() =>
    this.views()
      .filter((view) => view.upcoming)
      .sort((a, b) => this.startOf(a.schedule) - this.startOf(b.schedule))
  );

  // Reservas ya realizadas o canceladas: lo más reciente primero
  protected readonly history = computed(() =>
    this.views()
      .filter((view) => !view.upcoming)
      .sort((a, b) => this.startOf(b.schedule) - this.startOf(a.schedule))
  );

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set('');

    forkJoin({
      bookings: this.bookingService.getMyBookings(),
      schedules: this.scheduleService.getSchedules(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ bookings, schedules }) => {
          this.bookings.set(bookings);
          this.schedules.set(schedules);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected cancel(view: BookingView): void {
    if (this.busy() || view.booking.status !== 'CONFIRMED') return;

    const schedule = view.schedule;
    const detail = schedule
      ? `${schedule.fieldName} el ${this.formatDate(schedule.date)} ` +
        `de ${schedule.startTime} a ${schedule.endTime}`
      : 'esta reserva';

    if (!window.confirm(`¿Cancelar la reserva de ${detail}?`)) return;

    this.error.set('');
    this.success.set('');
    this.working.set(true);

    this.bookingService
      .cancelBooking(view.booking._id)
      .pipe(finalize(() => this.working.set(false)))
      .subscribe({
        next: () => {
          this.bookings.update((items) =>
            items.map((item) =>
              item._id === view.booking._id
                ? { ...item, status: 'CANCELLED' as const }
                : item
            )
          );

          this.success.set('Reserva cancelada. El horario quedó disponible.');
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.messageFor(error));
        },
      });
  }

  protected statusLabel(view: BookingView): string {
    if (view.booking.status === 'CANCELLED') return 'Cancelada';

    return view.upcoming ? 'Confirmada' : 'Finalizada';
  }

  // Inicio del horario en milisegundos; NaN si faltan datos
  private startOf(schedule: Schedule | null): number {
    if (!schedule?.date || !schedule.startTime) return Number.NaN;

    return new Date(
      `${schedule.date.slice(0, 10)}T${schedule.startTime}:00`
    ).getTime();
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
        return 'No tenés permiso para cancelar esta reserva.';
      case 404:
        return 'La reserva ya no existe. Actualizá la lista.';
      case 409:
        return 'Esa reserva ya estaba cancelada. Actualizá la lista.';
      default:
        return 'El servidor no pudo completar la operación. Actualizá la lista antes de reintentar.';
    }
  }
}
