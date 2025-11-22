import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DistritoResponse } from '../models/accommodation.models';
import { UniversidadResponse } from '../models/accommodation.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/distritos`;

    constructor() { }

    getZones(): Observable<DistritoResponse[]> {
        return this.http.get<DistritoResponse[]>(this.apiUrl);
    }

    getZoneById(id: number): Observable<DistritoResponse | undefined> {
        return this.http.get<DistritoResponse>(`${this.apiUrl}/${id}`);
    }

    getZoneByName(name: string): Observable<DistritoResponse | undefined> {
        return this.http.get<DistritoResponse>(`${this.apiUrl}/nombre/${name}`);
    }

    getUniversityByName(name: string): Observable<UniversidadResponse | undefined> {
        return this.http.get<UniversidadResponse>(`${this.apiUrl}/universidades/nombre/${name}`);
    }

    // Obtener todos los distritos
    getAllDistricts(): Observable<DistritoResponse[]> {
        return this.http.get<DistritoResponse[]>(this.apiUrl);
    }

    // Obtener un distrito por ID (para el detalle)
    getDistrictById(id: number): Observable<DistritoResponse> {
        return this.http.get<DistritoResponse>(`${this.apiUrl}/${id}`);
    }
}
