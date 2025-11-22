import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SolicitudResponse, EstadoSolicitud } from '../models/interaction.models';
import { LandlordRequestViewModel, MyRentalViewModel } from '../models/ui-view.models';
import { environment } from '../../../environments/environment';
import { PropietarioProfileResponse } from '../models/auth.models';
import { AlojamientoResponse } from '../models/accommodation.models';

@Injectable({
    providedIn: 'root'
})
export class LandlordService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    constructor() { }

    getProfile(): Observable<PropietarioProfileResponse> {
        return this.http.get<PropietarioProfileResponse>(`${this.apiUrl}/propietarios/me`);
    }

    getProfileId(): Observable<number> {
        return this.getProfile().pipe(map(p => p.id));
    }

    getMyAccommodations(): Observable<MyRentalViewModel[]> {
        return this.getProfileId().pipe(
            switchMap(id => this.http.get<AlojamientoResponse[]>(`${this.apiUrl}/alojamientos/propietario/${id}`)),
            map(dtos => dtos.map(dto => ({
                id: dto.id,
                image: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
                price: dto.precioMensual,
                district: dto.distrito,
                description: dto.descripcion,
                area: dto.area,
                baths: dto.banios,
                rooms: dto.habitaciones,
                clicks: 0, // Mock as backend doesn't provide this yet
                requestsCount: 0 // This should ideally come from backend or be calculated
            })))
        );
    }

    getAllRequests(): Observable<LandlordRequestViewModel[]> {
        return this.getProfileId().pipe(
            switchMap(id => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/propietario/${id}`)),
            map(dtos => dtos.map(dto => this.mapToViewModel(dto)))
        );
    }

    getRequestsByAccommodationId(accommodationId: number): Observable<LandlordRequestViewModel[]> {
        return this.getProfileId().pipe(
            switchMap(id => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/propietario/${id}`)),
            map(dtos => dtos
                .filter(r => r.alojamientoId === accommodationId)
                .map(dto => this.mapToViewModel(dto))
            )
        );
    }

    updateRequestStatus(requestId: number, newStatus: EstadoSolicitud): Observable<void> {
        // Assuming endpoint like PUT /solicitudes/{id}/estado
        return this.http.put<void>(`${this.apiUrl}/solicitudes/${requestId}/estado`, { estado: newStatus });
    }

    private mapToViewModel(dto: SolicitudResponse): LandlordRequestViewModel {
        return {
            id: dto.id,
            requestId: dto.id,
            accommodationTitle: dto.tituloAlojamiento || 'Alojamiento',
            applicantName: dto.nombreEstudiante,
            studentName: dto.nombreEstudiante,
            studentPhotoUrl: `https://ui-avatars.com/api/?name=${dto.nombreEstudiante}`, // Placeholder
            studentUniversity: 'Universidad', // Placeholder
            message: dto.mensaje,
            studentMessage: dto.mensaje,
            status: this.mapStatus(dto.estado),
            statusColor: this.getStatusColor(dto.estado),
            statusLabel: this.getStatusLabel(dto.estado),
            date: new Date(), // Date not in response
            requestDate: new Date()
        };
    }

    private mapStatus(estado: EstadoSolicitud): 'reciente' | 'pendiente' | 'agendado' {
        switch (estado) {
            case 'PENDIENTE': return 'pendiente';
            case 'ACEPTADO': return 'agendado';
            case 'RECHAZADO': return 'pendiente';
            default: return 'reciente';
        }
    }

    private getStatusColor(status: EstadoSolicitud): 'green' | 'yellow' | 'red' | 'gray' {
        switch (status) {
            case 'ACEPTADO': return 'green';
            case 'PENDIENTE': return 'yellow';
            case 'RECHAZADO': return 'red';
            case 'AGENDADO': return 'gray';
            default: return 'gray';
        }
    }

    private getStatusLabel(status: EstadoSolicitud): string {
        switch (status) {
            case 'ACEPTADO': return 'Aceptado';
            case 'PENDIENTE': return 'Pendiente';
            case 'RECHAZADO': return 'Rechazado';
            case 'AGENDADO': return 'Agendado';
            default: return status;
        }
    }
}
