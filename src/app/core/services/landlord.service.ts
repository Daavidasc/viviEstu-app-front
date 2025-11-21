import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RequestDetailedItem, RequestActionPayload } from '../models/landlord.models';

@Injectable({
    providedIn: 'root'
})
export class LandlordService {

    private mockDetailedRequests: RequestDetailedItem[] = [
        {
            id: 1,
            accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.',
            applicantName: 'Marcelo Hernandez',
            status: 'reciente',
            requestDate: new Date('2025-01-15'),
            studentMessage: 'Hola, estoy interesado en este departamento para el próximo semestre. ¿Podríamos agendar una visita?',
            studentPhotoUrl: 'https://i.pravatar.cc/150?img=12',
            studentUniversity: 'UPC'
        },
        {
            id: 2,
            accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.',
            applicantName: 'Ana García',
            status: 'pendiente',
            requestDate: new Date('2025-01-14'),
            studentMessage: '¿El precio incluye servicios?',
            studentPhotoUrl: 'https://i.pravatar.cc/150?img=5',
            studentUniversity: 'ESAN'
        },
        {
            id: 3,
            accommodationTitle: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.',
            applicantName: 'Carlos Mendoza',
            status: 'agendado',
            requestDate: new Date('2025-01-13'),
            studentMessage: 'Me gustaría visitarlo este fin de semana.',
            studentPhotoUrl: 'https://i.pravatar.cc/150?img=8',
            studentUniversity: 'UPC'
        }
    ];

    constructor() { }

    getRequestsByAccommodationId(accommodationId: number): Observable<RequestDetailedItem[]> {
        // Simular filtrado por accommodationId - por ahora devuelve todos
        return of(this.mockDetailedRequests);
    }

    updateRequestStatus(payload: RequestActionPayload): Observable<void> {
        // Simular actualización en el array local
        const request = this.mockDetailedRequests.find(r => r.id === payload.requestId);
        if (request) {
            request.status = payload.newStatus.toLowerCase() as 'reciente' | 'pendiente' | 'agendado';
        }
        console.log('Request status updated:', payload);
        return of(void 0);
    }
}
