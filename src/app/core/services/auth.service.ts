import { StorageService } from './storage.service';

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
    LoginRequest, AuthResponse, UserResponse, RoleType,
    RegisterEstudianteRequest, RegisterPropietarioRequest
} from '../models/user.model'; // Asegúrate de que esta ruta es correcta
import { environment } from '../../../environments/environment';

// --- Asume que tienes estos modelos/interfaces en user.model.ts ---
// export interface RegisterEstudianteRequest { /* ... campos ... */ }
// export interface RegisterPropietarioRequest { /* ... campos ... */ }
// export interface AuthResponse { token: string; correo: string; nombre: string; role?: RoleType; }
// export enum RoleType { ROLE_ESTUDIANTE = 'ROLE_ESTUDIANTE', ROLE_PROPIETARIO = 'ROLE_PROPIETARIO', ROLE_ADMIN = 'ROLE_ADMIN' }
// ---

@Injectable({
    providedIn: 'root'
})
export class AuthService {
<<<<<<< HEAD
  getToken(): string | null {
    // Preferiblemente devuelve el valor reactivo
    return this.token();
    // O el valor almacenado si el signal aún no se ha inicializado
    // return this.storage.getItem('token');
  }
  private http = inject(HttpClient);
  private storage = inject(StorageService); // Asumiendo que existe un StorageService
  private router = inject(Router);
=======
    getToken() {
        throw new Error('Method not implemented.');
    }
    private http = inject(HttpClient);
    private storage = inject(StorageService); // Asumiendo que existe un StorageService
    private router = inject(Router);
>>>>>>> edae84523995463f8b43fe780981f4ff438db5ae

    // URL base, ajusta según tu configuración
    private apiUrl = `${environment.apiUrl}/auth`;

    // Signals para ESTADO COMPARTIDO (Mantenemos la implementación anterior)
    private _currentUser = signal<UserResponse | null>(null);
    private _isAuthenticated = signal<boolean>(false);
    private _token = signal<string | null>(null);

    currentUser = this._currentUser.asReadonly();
    isAuthenticated = this._isAuthenticated.asReadonly();
    token = this._token.asReadonly();

    constructor() {
        this.loadAuthData();
    }

    // POST - Login (implementación básica)
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.saveAuthData(response);
            })
        );
    }

    // POST - Registro de Estudiante
    // CORRECCIÓN: Se espera 'string' y se usa responseType: 'text' para evitar el error de parsing 200.
    registerEstudiante(data: RegisterEstudianteRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/register/estudiante`, data, { responseType: 'text' as 'json' as 'text' });
    }

    // POST - Registro de Propietario
    // CORRECCIÓN: Se espera 'string' y se usa responseType: 'text' para evitar el error de parsing 200.
    registerPropietario(data: RegisterPropietarioRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/register/propietario`, data, { responseType: 'text' as 'json' as 'text' });
    }

    // Logout, saveAuthData, loadAuthData, etc. (mantienen la lógica de la respuesta anterior)
    logout(): void {
        this.storage.removeItem('token');
        this.storage.removeItem('user');
        this._currentUser.set(null);
        this._isAuthenticated.set(false);
        this._token.set(null);
        this.router.navigate(['/auth/login']);
    }

    // auth.service.ts

    private saveAuthData(response: AuthResponse): void {
        this.storage.setItem('token', response.token);
        this._token.set(response.token);

<<<<<<< HEAD
  const user: UserResponse = {
    id: response.id,
    // 🔥 CORRECCIÓN: Usar response.email y response.name 🔥
    email: response.email,
    name: response.name,
    role: response.role || RoleType.ROLE_ESTUDIANTE,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
=======
        const user: UserResponse = {
            id: '',
            // 🔥 CORRECCIÓN: Usar response.email y response.name 🔥
            email: response.email,
            name: response.name,
            role: response.role || RoleType.ROLE_ESTUDIANTE,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
>>>>>>> edae84523995463f8b43fe780981f4ff438db5ae

        this.storage.setItem('user', user);
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
    }


    private loadAuthData(): void {
        const token = this.storage.getItem<string>('token');
        const user = this.storage.getItem<UserResponse>('user');

        if (token && user) {
            this._token.set(token);
            this._currentUser.set(user);
            this._isAuthenticated.set(true);
        }
    }

    isAdmin(): boolean {
        return this._currentUser()?.role === RoleType.ROLE_ADMIN;
    }



}
