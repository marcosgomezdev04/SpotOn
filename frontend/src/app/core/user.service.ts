import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/user';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAll`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/getById/${encodeURIComponent(id)}`
    );
  }

  updateUser(id: string, data: UpdateUserData): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/update/${encodeURIComponent(id)}`,
      data
    );
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/delete/${encodeURIComponent(id)}`
    );
  }
} 