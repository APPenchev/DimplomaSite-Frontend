import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/users'; // Base URL for user-related API endpoints

  constructor(private http: HttpClient) {}

  // Create a new student
  createStudent(studentPayload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-student`, studentPayload);
  }

  // Create a new teacher
  createTeacher(teacherPayload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-teacher`, teacherPayload);
  }

  // Delete a user by their Keycloak ID
  deleteUser(keycloakId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${keycloakId}`);
  }
}