import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8082/api/students';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getStudentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getStudentsWhoPassedBetweenDates(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/passed-between?startDate=${startDate}&endDate=${endDate}`);
  }

  updateStudent(id: number, studentPayload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, studentPayload);
  }

  getStudentByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/name/${name}`);
  }

  getStudentByThesis(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/thesis/${name}`);
  }
  
  getStudentByFacultyNumber(facultyNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/facultyNumber/${facultyNumber}`);
  }
}