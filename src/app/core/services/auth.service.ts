import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    LoginRequest,
    AuthResponse,
    RegisterEstudianteRequest,
    RegisterPropietarioRequest
} from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`; // Ajustar según endpoint real

    // Login
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
    }

    // Registro Estudiante
    registerStudent(data: RegisterEstudianteRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register/student`, data);
    }

    // Registro Propietario
    registerLandlord(data: RegisterPropietarioRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register/landlord`, data);
    }

    // Logout (simulado o llamada al backend si es necesario)
    logout(): void {
        localStorage.removeItem('token');
        // Redirección o limpieza de estado
    }
}
