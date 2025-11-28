import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DistritoResponse,
  UniversidadResponse,
  DistrictDetailViewModel
} from '../models/location.models';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getAllDistricts(): Observable<DistritoResponse[]> {
    return this.http.get<DistritoResponse[]>(`${this.apiUrl}/distritos`);
  }

  getDistrictById(id: number): Observable<DistrictDetailViewModel> {
    return this.http.get<DistrictDetailViewModel>(`${this.apiUrl}/distritos/${id}`);
  }

  getAllUniversities(): Observable<UniversidadResponse[]> {
    return this.http.get<UniversidadResponse[]>(`${this.apiUrl}/universidades`);
  }
}
