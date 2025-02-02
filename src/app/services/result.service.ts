import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = 'http://localhost:8082/api/defense-results'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  // Create a new defense result
  createDefenseResult(data: { grade: number; defenseId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Update an existing defense result
  updateDefenseResult(id: number, data: { grade: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete a defense result
  deleteDefenseResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get a defense result by ID
  getDefenseResultById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Link a defense result to a diploma defense
  linkResultToDefense(resultId: number, defenseId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${resultId}/link-defense/${defenseId}`, null);
  }
}