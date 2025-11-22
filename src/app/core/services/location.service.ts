import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, retry, catchError } from 'rxjs/operators';
import { DistritoResponse } from '../models/accommodation.models';
import { UniversidadResponse } from '../models/accommodation.models';
import { environment } from '../../../environments/environment';
import { DistrictDetailViewModel } from '../models/ui-view.models';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    // Timeout de 60 segundos para cold starts de Render
    private readonly TIMEOUT_MS = 60000;
    private readonly MAX_RETRIES = 2;

    constructor() { }

    getZoneByName(name: string): Observable<DistritoResponse | undefined> {
        return this.http.get<DistritoResponse>(`${this.apiUrl}/distritos/nombre/${name}`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }

    getUniversityByName(name: string): Observable<UniversidadResponse | undefined> {
        return this.http.get<UniversidadResponse>(`${this.apiUrl}/universidades/nombre/${name}`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }

    // Obtener todos los distritos
    getAllDistricts(): Observable<DistritoResponse[]> {
        return this.http.get<DistritoResponse[]>(`${this.apiUrl}/distritos`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }

    // Obtener un distrito por ID (para el detalle)
    getDistrictById(id: number): Observable<DistritoResponse> {
        return this.http.get<DistritoResponse>(`${this.apiUrl}/distritos/${id}`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }

    // Obtener todas las universidades
    getAllUniversities(): Observable<UniversidadResponse[]> {
        return this.http.get<UniversidadResponse[]>(`${this.apiUrl}/universidades`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }

    // Método alias para compatibilidad
    getAllZones(): Observable<DistritoResponse[]> {
        return this.getAllDistricts();
    }
    getDetailedDistrictById(id: number): Observable<DistrictDetailViewModel> {
        return this.http.get<DistrictDetailViewModel>(`${this.apiUrl}/distritos/${id}`).pipe(
            timeout(this.TIMEOUT_MS),
            retry(this.MAX_RETRIES)
        );
    }
}
