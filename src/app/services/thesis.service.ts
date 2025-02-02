import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThesisService {
  private apiUrl = 'http://localhost:8082/api/diploma-thesis';

  constructor(private http: HttpClient) {}

  getThesisById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  deleteThesis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  updateThesis(id: number, thesisPayload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, thesisPayload);
  }
  
  getThesisByStudent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }
  
  createThesis(thesisPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, thesisPayload);
  }
}