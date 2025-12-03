import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { LandlordProfile, MyRentalViewModel, AccommodationAnalyticsResponse, AccommodationAnalyticsViewModel } from '../models/landlord.models';
import { AlojamientoResponse } from '../models/accommodation.models';
import { SolicitudResponse, RequestViewModel } from '../models/request.models';

@Injectable({
  providedIn: 'root'
})
export class LandlordService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // === PERFIL ===
  getProfile(): Observable<LandlordProfile> {
    return this.http.get<LandlordProfile>(`${this.apiUrl}/propietarios/me`);
  }

  // 👇 NUEVO: Método para actualizar perfil
  updateProfile(data: LandlordProfile): Observable<any> {
    return this.http.put(`${this.apiUrl}/propietarios/me`, data);
  }

  // === MIS ALQUILERES ===
  getMyAccommodations(): Observable<MyRentalViewModel[]> {
    return this.getProfile().pipe(
      switchMap(p => this.http.get<AlojamientoResponse[]>(`${this.apiUrl}/alojamientos/propietario/${p.id}`)),
      map(dtos => dtos.map(dto => ({
        id: dto.id,
        image: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
        price: dto.precioMensual,
        district: dto.distrito,
        description: dto.descripcion,
        area: dto.area,
        baths: dto.banios,
        rooms: dto.habitaciones,
        clicks: 0,
        requestsCount: 0
      })))
    );
  }

  // === SOLICITUDES ===
  getIncomingRequests(): Observable<RequestViewModel[]> {
    return this.getProfile().pipe(
      switchMap(p => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/propietario/${p.id}`)),
      map(dtos => dtos.map(dto => this.mapToRequestViewModel(dto)))
    );
  }

  getRequestsByAccommodationId(accommodationId: number): Observable<RequestViewModel[]> {
    return this.getProfile().pipe(
      switchMap(p => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/propietario/${p.id}`)),
      map(dtos => dtos
        .filter(r => r.alojamientoId === accommodationId)
        .map(dto => this.mapToRequestViewModel(dto))
      )
    );
  }


  // === ACTUALIZAR ESTADO DE SOLICITUD ===
  updateRequestStatus(requestId: number, status: 'ACEPTADO' | 'RECHAZADO'): Observable<any> {
    return this.http.put(`${this.apiUrl}/solicitudes/${requestId}/estado`, { estado: status });
  }

  // === ESTADÍSTICAS DE ALOJAMIENTOS ===
  getAccommodationAnalytics(): Observable<AccommodationAnalyticsViewModel[]> {
    return this.getProfile().pipe(
      switchMap(p => this.http.get<AccommodationAnalyticsResponse[]>(`${this.apiUrl}/interacciones/propietario/${p.id}/reporte`)),
      map(dtos => dtos.map(dto => this.mapToAnalyticsViewModel(dto)))
    );
  }

  getAccommodationTotalInteractions(accommodationId: number): Observable<number> {
    return this.http.get<AccommodationAnalyticsResponse | AccommodationAnalyticsResponse[]>(`${this.apiUrl}/interacciones/reporte/${accommodationId}`)
      .pipe(map(response => {
        if (Array.isArray(response)) {
          return response.map(dto => dto.totalInteracciones).reduce((a, b) => a + b, 0);
        }
        return response?.totalInteracciones ?? 0;
      }));
  }

  private mapToAnalyticsViewModel(dto: AccommodationAnalyticsResponse): AccommodationAnalyticsViewModel {
    const lastInteractionDate = new Date(dto.ultimaInteraccion);

    return {
      id: dto.alojamientoId,
      name: dto.nombreAlojamiento,
      totalInteractions: dto.totalInteracciones,
      uniqueStudents: dto.estudiantesUnicos,
      lastInteraction: lastInteractionDate,
      topUniversity: dto.universidadPrincipal,
      topDistrict: dto.distritoPrincipal,
      avgInteractionsPerStudent: dto.promedioInteraccionesPorEstudiante,
      formattedLastInteraction: this.formatDate(lastInteractionDate)
    };
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-PE');
  }

  private mapToRequestViewModel(dto: SolicitudResponse): RequestViewModel {
    let color: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
    if (dto.estado === 'ACEPTADO') color = 'green';
    else if (dto.estado === 'PENDIENTE') color = 'yellow';
    else if (dto.estado === 'RECHAZADO') color = 'red';

    return {
      requestId: dto.id,
      accommodationId: dto.alojamientoId,
      title: dto.nombreEstudiante,
      subtitle: dto.tituloAlojamiento,
      image: `https://ui-avatars.com/api/?name=${dto.nombreEstudiante}`,
      status: dto.estado,
      statusColor: color,
      message: dto.mensaje,
      price: dto.oferta
    };
  }
}
