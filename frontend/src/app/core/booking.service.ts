import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Booking {
  _id: string;
  userId: string;
  scheduleId: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/booking';

  createBooking(scheduleId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/post`, {
      scheduleId,
    });
  }
} 