import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8082/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getApprovedReviewsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/approved-count`);
  }

  updateReview(id: number, review: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, review);
  }

  createReview(reviewPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, reviewPayload);
  }

}