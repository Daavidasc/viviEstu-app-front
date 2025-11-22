import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SolicitudResponse, EstadoSolicitud } from '../models/interaction.models';
import { LandlordRequestViewModel } from '../models/ui-view.models';

@Injectable({
    providedIn: 'root'
})
export class LandlordService {

    private mockRequests: SolicitudResponse[] = [
        {
            id: 1,
            mesesAlquiler: 6,
            cantInquilinos: 1,
            mensaje: 'Hola, estoy interesado en este departamento para el próximo semestre. ¿Podríamos agendar una visita?',
            oferta: 650,

            estado: 'PENDIENTE',
            estudiantesId: 101,
            nombreEstudiante: 'Marcelo Hernandez',
            alojamientoId: 1,
            tituloAlojamiento: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.'
        },
        {
            id: 2,
            mesesAlquiler: 12,
            cantInquilinos: 2,
            mensaje: '¿El precio incluye servicios?',
            oferta: 1200,
            estado: 'PENDIENTE',
            estudiantesId: 102,
            nombreEstudiante: 'Ana García',
            alojamientoId: 1,
            tituloAlojamiento: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.'
        },
        {
            id: 3,
            mesesAlquiler: 4,
            cantInquilinos: 1,
            mensaje: 'Me gustaría visitarlo este fin de semana.',
            oferta: 650,
            estado: 'AGENDADO',
            estudiantesId: 103,
            nombreEstudiante: 'Carlos Mendoza',
            alojamientoId: 1,
            tituloAlojamiento: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.'
        }
    ];

    constructor() { }

    getRequestsByAccommodationId(accommodationId: number): Observable<LandlordRequestViewModel[]> {
        // Simular filtrado por accommodationId
        const requests = this.mockRequests.filter(r => r.alojamientoId === accommodationId || true); // Mock: return all for now or filter

        return of(requests).pipe(
            map(dtos => dtos.map(dto => this.mapToViewModel(dto)))
        );
    }

    updateRequestStatus(requestId: number, newStatus: EstadoSolicitud): Observable<void> {
        const request = this.mockRequests.find(r => r.id === requestId);
        if (request) {
            request.estado = newStatus;
        }
        console.log(`Request ${requestId} status updated to ${newStatus}`);
        return of(void 0);
    }

    private mapToViewModel(dto: SolicitudResponse): LandlordRequestViewModel {
        return {
            id: dto.id,
            requestId: dto.id,
            accommodationTitle: 'Departamento', // Mock as not in DTO
            applicantName: dto.nombreEstudiante,
            studentName: dto.nombreEstudiante,
            studentPhotoUrl: `https://i.pravatar.cc/150?img=${dto.estudiantesId % 70}`,
            studentUniversity: 'UPC',
            message: dto.mensaje,
            studentMessage: dto.mensaje,
            status: this.mapStatus(dto.estado),
            statusColor: this.getStatusColor(dto.estado),
            statusLabel: this.getStatusLabel(dto.estado),
            date: new Date(),
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
            case 'AGENDADO': return 'gray'; // Or blue if available, defaulting to gray
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
