import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = 'http://localhost:8082/api/diploma-assignments';

  constructor(private http: HttpClient) {}

  getAllAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-status`);
  }

  getAllAssignmentsByTeacher(teacher: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-status/teacher/${teacher}`);
  }

  getAllAssignmentsByTopic(topic: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-status/${topic}`);
  }

  createAssignment(assignmentPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, assignmentPayload);
  }

  getAssignmentByStudent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  getAssignmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateAssignment(id: number, assignmentPayload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, assignmentPayload);
  }

  approveAssignment(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}