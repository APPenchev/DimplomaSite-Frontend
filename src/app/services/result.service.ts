import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = 'http://localhost:8082/api/defense-results'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  createDefenseResult(data: { grade: number; defenseId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updateDefenseResult(id: number, data: { grade: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDefenseResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDefenseResultById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  linkResultToDefense(resultId: number, defenseId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${resultId}/link-defense/${defenseId}`, null);
  }
}