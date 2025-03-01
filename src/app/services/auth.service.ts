import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:8082/api/users/token';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<string> {
    return this.http.post<{ token: string }>(this.loginUrl, credentials).pipe(
      map(response => response.token)
    );
  }

  storeToken(token: string): void {
    console.log('Storing token:', token);
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now(); 
      return expirationTime < currentTime; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }

    try {
      const decoded: any = jwtDecode(token);
      const roles =
        decoded.resource_access?.['diploma-application']?.roles || []; 
      return roles;
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  getTeacherByKeycloakId(keycloakId: string): Observable<any> {
    const url = `http://localhost:8082/api/teachers/by-keycloak/${keycloakId}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching teacher by Keycloak ID:', error);
        return of(null);
      })
    );
  }
  
  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded.preferred_username || null; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }


  logout(): void {
    this.clearToken();
  }
}