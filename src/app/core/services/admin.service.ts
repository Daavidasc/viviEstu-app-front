import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    UniversidadResponse,
    DistritoResponse,
    DistrictDetailViewModel
} from '../models/location.models';
import { AdminStats } from '../models/admin.models';
// Assuming models for Student, Landlord, Accommodation exist or will be created. 
// For now using any or defining interfaces here if not present.
// Ideally we should have models. 
// I will define basic interfaces here or import if I find them.
// Based on file list, there is 'interaction.models.ts', 'auth.models.ts', 'location.models.ts'.
// I might need to create 'admin.models.ts' or use existing ones.
// For now I will use 'any' for missing models and refactor later or define them in a new model file.

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    // --- Universities ---
    createUniversity(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/universidades`, data);
    }

    updateUniversity(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/universidades/${id}`, data);
    }

    deleteUniversity(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/universidades/${id}`);
    }

    // --- Districts ---
    createDistrict(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/distritos`, data);
    }

    updateDistrict(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/distritos/${id}`, data);
    }

    deleteDistrict(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/distritos/${id}`);
    }

    // --- Students ---
    getStudents(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/estudiantes`);
    }

    getStudent(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/estudiantes/${id}`);
    }

    banStudent(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/estudiantes/${id}`);
    }

    // --- Landlords ---
    getLandlords(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/propietarios`);
    }

    getLandlord(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/propietarios/${id}`);
    }

    deleteLandlord(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/propietarios/${id}`);
    }

    // --- Accommodations ---
    getAccommodations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/alojamientos`);
    }

    updateAccommodationStatus(id: number, status: 'alquilar' | 'liberar'): Observable<any> {
        return this.http.put(`${this.apiUrl}/alojamientos/${id}/${status}`, {});
    }

    deleteAccommodation(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/alojamientos/${id}`);
    }

    // --- Comments ---
    getComments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/comentarios`);
    }

    deleteComment(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/comentarios/${id}`);
    }

    // --- Stats ---
    getDashboardStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/admin/stats`);
    }
}
