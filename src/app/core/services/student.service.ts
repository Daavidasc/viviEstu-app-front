import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';



// Importar ViewModels
import { AccommodationCardViewModel, StudentProfileViewModel, StudentRequestViewModel } from '../models/ui-view.models';

// Importar AccommodationService para buscar detalles de favoritos
import { AccommodationService } from './accommodation.service';
import { EstudianteResponseDTO, FavoritosResponseDTO, SolicitudResponseDTO } from '../models/api-response';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    // Endpoints de la API
    private estudiantesUrl = 'http://localhost:8080/api/v1/estudiantes';
    private favoritosUrl = 'http://localhost:8080/api/v1/favoritos';
    private solicitudesUrl = 'http://localhost:8080/api/v1/solicitudes';

    // ** TEMPORAL: ID del estudiante logueado (debe venir del servicio de Auth/Token) **
    private currentStudentId = 1;

    constructor(
        private http: HttpClient,
        private accommodationService: AccommodationService // Necesario para obtener detalles de la tarjeta de alojamiento
    ) { }

    // --- 1. Obtener Perfil (getProfile) ---
    getProfile(): Observable<StudentProfileViewModel> {
        // Endpoint: GET /estudiantes/{id}
        return this.http.get<EstudianteResponseDTO>(`${this.estudiantesUrl}/${this.currentStudentId}`)
            .pipe(
                map((dto: EstudianteResponseDTO) => ({
                    id: dto.id,
                    name: `${dto.nombre} ${dto.apellidos}`, // Campo calculado
                    university: dto.universidad,
                    district: dto.distrito,
                    career: dto.carrera,
                    currentCycle: dto.ciclo,
                    // Asegúrate de mapear todos los campos necesarios de StudentProfileViewModel
                    // Los campos que faltan (age, avatarUrl, etc.) se quedan como 'undefined' o deben ser calculados/mapeados
                } as StudentProfileViewModel))
            );
    }

    // --- 2. Obtener Favoritos (getFavorites) ---
    getFavorites(): Observable<AccommodationCardViewModel[]> {
        // Endpoint: GET /favoritos/estudiante/{estudianteId}
        return this.http.get<FavoritosResponseDTO[]>(`${this.favoritosUrl}/estudiante/${this.currentStudentId}`).pipe(
            // switchMap para cambiar de una lista de FavoritosDTOs a una lista de Observables (detalles de alojamiento)
            switchMap((favoritosDtos: FavoritosResponseDTO[]) => {
                if (favoritosDtos.length === 0) {
                    return new Observable<AccommodationCardViewModel[]>(subscriber => {
                        subscriber.next([]);
                        subscriber.complete();
                    });
                }

                // Crea un array de Observables, uno por cada AlojamientoCardViewModel (desde AccommodationService)
                const cardObservables = favoritosDtos.map(favDto =>
                    this.accommodationService.getCardById(favDto.alojamientoId) // **Ver nota abajo**
                );

                // forkJoin espera que todos los Observables se completen y emite un array con sus resultados
                return forkJoin(cardObservables).pipe(
                    // Filtra cualquier resultado nulo si getCardById devuelve null
                    map(cards => cards.filter(card => card !== null) as AccommodationCardViewModel[])
                );
            })
        );
    }

    // --- 3. Obtener Solicitudes (getRequests) ---
    getRequests(): Observable<StudentRequestViewModel[]> {
        // Endpoint: GET /solicitudes/estudiante/{id}
        return this.http.get<SolicitudResponseDTO[]>(`${this.solicitudesUrl}/estudiante/${this.currentStudentId}`).pipe(
            map((dtos: SolicitudResponseDTO[]) => dtos.map(dto => {
                let statusColor: 'green' | 'yellow' | 'red' | 'gray';

                switch (dto.estado) {
                    case 'ACEPTADO':
                        statusColor = 'green';
                        break;
                    case 'RECHAZADO':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = 'yellow'; // PENDIENTE o cualquier otro
                        break;
                }

                return {
                    requestId: dto.id,
                    thumbnailUrl: 'assets/placeholder-request.jpg', // No hay URL en SolicitudDTO, usa un placeholder temporal
                    price: dto.oferta, // Usar la oferta como precio de referencia
                    district: 'N/A', // El DTO no tiene el distrito, se podría obtener en otro paso
                    status: dto.estado,
                    statusColor: statusColor
                } as StudentRequestViewModel;
            }))
        );
    }
}
