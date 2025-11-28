import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  LoginRequest,
  AuthResponse,
  RegisterEstudianteRequest,
  RegisterPropietarioRequest,
  RoleType
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals para estado reactivo
  private _currentUser = signal<AuthResponse | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    this.loadAuthData();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveAuthData(response))
    );
  }

  registerEstudiante(data: RegisterEstudianteRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register/estudiante`, data, { responseType: 'text' });
  }

  registerPropietario(data: RegisterPropietarioRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/register/propietario`, data, { responseType: 'text' });
  }

  logout(): void {
    this.storage.removeItem('auth_data');
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(response: AuthResponse): void {
    this.storage.setItem('auth_data', response);
    this._currentUser.set(response);
    this._isAuthenticated.set(true);
  }

  private loadAuthData(): void {
    const data = this.storage.getItem<AuthResponse>('auth_data');
    if (data && data.token) {
      this._currentUser.set(data);
      this._isAuthenticated.set(true);
    }
  }

  getToken(): string | null {
    return this._currentUser()?.token || null;
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === RoleType.ROLE_ADMIN;
  }
}
