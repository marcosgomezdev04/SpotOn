import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Schedule {
  _id: string;
  fieldName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED';
}

export interface CreateScheduleData {
  fieldName: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/schedule';

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/getAll`);
  }

  getScheduleById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(
      `${this.apiUrl}/getById/${encodeURIComponent(id)}`
    );
  }

  createSchedule(data: CreateScheduleData): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/post`, data);
  }

  updateSchedule(
    id: string,
    data: CreateScheduleData
  ): Observable<Schedule> {
    return this.http.put<Schedule>(
      `${this.apiUrl}/update/${encodeURIComponent(id)}`,
      data
    );
  }

  deleteSchedule(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/delete/${encodeURIComponent(id)}`
    );
  }
} 