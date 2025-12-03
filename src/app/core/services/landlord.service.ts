import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { LandlordProfile, MyRentalViewModel } from '../models/landlord.models';
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
    // 1. Determinar el endpoint según la acción
    const action = status === 'ACEPTADO' ? 'aceptar' : 'rechazar';

    // 2. Construir la URL correcta que espera tu backend
    // Ejemplo: /api/v1/solicitudes/11/aceptar
    const url = `${this.apiUrl}/solicitudes/${requestId}/${action}`;

    // 3. Enviar la petición PUT.
    // Nota: Tu backend NO pide @RequestBody, así que enviamos un objeto vacío {} o null.
    return this.http.put(url, {});
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

      // ✅ AGREGAR ESTOS MAPEOS:
      price: dto.oferta,            // Mapea oferta -> price
      months: dto.mesesAlquiler,    // Mapea mesesAlquiler -> months
      occupants: dto.cantInquilinos // Mapea cantInquilinos -> occupants
    };
  }
}
