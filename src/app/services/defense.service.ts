import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefenseService {
  private apiUrl = 'http://localhost:8082/api/diploma-defense';

  constructor(private http: HttpClient) {}
  
  getAverageDefendedBetweenDates(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/average-students-defended?startDate=${startDate}&endDate=${endDate}`
    );
  }

  createDefense(defenseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, defenseData);
  }

  deleteDefense(defenseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${defenseId}`);
  }

  getDefensesByThesisId(thesisId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/thesis/${thesisId}`);
  }
}