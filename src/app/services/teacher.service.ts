import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:8082/api/teachers';

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getTeacherById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getGraduateCountForTeacher(teacherId: number, passingGrade: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${teacherId}/count-successful-graduates/${passingGrade}`);
  }

  getTeachersByName(namePart: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/name/${namePart}`);
  }

  getTeachersByPosition(position: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/position/${position}`);
  }

  updateTeacher(id: number, teacherPayload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, teacherPayload);
  }

}
