import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  fullName: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/auth';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private role$ = new BehaviorSubject<string>(this.getRole());

  isLoggedIn$ = this.loggedIn$.asObservable();
  currentRole$ = this.role$.asObservable();

  constructor(private http: HttpClient) {}

  register(req: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API}/register`, req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, req).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('fullName', res.fullName);
        sessionStorage.setItem('email', res.email);
        sessionStorage.setItem('role', res.role);
        this.loggedIn$.next(true);
        this.role$.next(res.role);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullName');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    this.loggedIn$.next(false);
    this.role$.next('');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  getRole(): string {
    return sessionStorage.getItem('role') || '';
  }

  getFullName(): string {
    return sessionStorage.getItem('fullName') || '';
  }

  getEmail(): string {
    return sessionStorage.getItem('email') || '';
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return parseInt(decoded.sub, 10);
    } catch {
      return 0;
    }
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
