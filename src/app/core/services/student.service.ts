import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../models/ui-view.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstudianteProfileResponse } from '../models/auth.models';
import { FavoritoResponse, SolicitudResponse } from '../models/interaction.models';
import { AlojamientoResponse } from '../models/accommodation.models';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AccommodationService } from './accommodation.service';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private http = inject(HttpClient);
    private accommodationService = inject(AccommodationService);
    private apiUrl = `${environment.apiUrl}`;
    private currentStudent: EstudianteProfileResponse | null = null;
    constructor() { }

    getProfile(): Observable<EstudianteProfileResponse> {
        return this.http.get<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`);
    }

    updateProfile(profile: EstudianteProfileResponse): Observable<EstudianteProfileResponse> {
        this.currentStudent = { ...this.currentStudent, ...profile };
        return this.http.put<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`, profile);
    }


    getAllAccommodationsWithFavoriteStatus(): Observable<AccommodationCardViewModel[]> {
        return forkJoin({
            cards: this.accommodationService.getAllCards(),
            favorites: this.getFavorites()
        }).pipe(
            map(({ cards, favorites }) => {
                const favIds = new Set(favorites.map(f => f.alojamientoId));
                return cards.map(c => ({ ...c, isFavorite: favIds.has(c.id) }));
            })
        );
    }

    getRequests(): Observable<StudentRequestViewModel[]> {
        return this.getEstudianteIdOrFail().pipe(
            switchMap(id => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/estudiante/${id}`)),
            switchMap(requests => {
                if (requests.length === 0) {
                    return of([]);
                }
                const tasks = requests.map(req =>
                    this.accommodationService.getThumbnailUrl(req.alojamientoId).pipe(
                        map(url => this.mapToRequestViewModel(req, url)),
                        // En caso de error al obtener la imagen, usamos placeholder
                        catchError(() => of(this.mapToRequestViewModel(req, 'assets/placeholder.jpg')))
                    )
                );
                return forkJoin(tasks);
            })
        );
    }

    private mapToRequestViewModel(request: SolicitudResponse, thumbnailUrl: string): StudentRequestViewModel {
        let statusColor: 'green' | 'yellow' | 'red' | 'gray' = 'gray';

        switch (request.estado) {
            case 'ACEPTADO':
            case 'AGENDADO':
                statusColor = 'green';
                break;
            case 'PENDIENTE':
                statusColor = 'yellow';
                break;
            case 'RECHAZADO':
                statusColor = 'red';
                break;
            default:
                statusColor = 'gray';
        }

        return {
            requestId: request.id,
            thumbnailUrl: thumbnailUrl,
            alojamientoId: request.alojamientoId,
            price: request.oferta, // Using offer as price
            district: request.tituloAlojamiento, // Using title as district/location placeholder
            status: request.estado,
            statusColor: statusColor
        };
    }

    getProfileId(): Observable<number> {
        return this.http.get<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`).pipe(map(response => response.id));
    }

    getViewProfile(): Observable<StudentProfileViewModel> {
        return this.http.get<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`).pipe(
            map(profile => this.mapToViewModel(profile))
        );
    }

    private mapToViewModel(profile: EstudianteProfileResponse): StudentProfileViewModel {
        return {
            ...profile,
            name: `${profile.nombre} ${profile.apellidos}`,
            university: profile.universidad,
            district: profile.distrito,
            career: profile.carrera,
            currentCycle: profile.ciclo,
            avatarUrl: profile.urlFotoPerfil || 'assets/images/avatar-placeholder.png',
            // Campos adicionales que no vienen del backend por ahora
            age: 20,
            preferredZone: profile.distrito,
            budget: 0
        };
    }

    private getEstudianteIdOrFail(): Observable<number> {
        return this.getProfileId().pipe(
            switchMap(id => {
                if (!id) {
                    return throwError(() => new Error('Estudiante no logueado.'));
                }
                return of(id);
            })
        );
    }

    // FIX: Corregido para usar getEstudianteIdOrFail() y así obtener el ID del usuario actual.
    getFavorites(): Observable<FavoritoResponse[]> {
        return this.getEstudianteIdOrFail().pipe(
            switchMap(estudianteId => {
                const url = `${this.apiUrl}/favoritos/estudiante/${estudianteId}`;
                return this.http.get<FavoritoResponse[]>(url);
            })
        );
    }

    // NUEVO: Añadir un alojamiento a favoritos (POST)
    addFavorite(alojamientoId: number): Observable<FavoritoResponse> {
        return this.getEstudianteIdOrFail().pipe(
            switchMap(estudianteId => {
                const url = `${this.apiUrl}/favoritos/estudiante/${estudianteId}/alojamiento/${alojamientoId}`;
                // El endpoint POST retorna FavoritosResponseDTO (mapeado a FavoritoResponse)
                return this.http.post<FavoritoResponse>(url, {});
            })
        );
    }

    // NUEVO: Eliminar un alojamiento de favoritos (DELETE)
    removeFavorite(alojamientoId: number): Observable<void> {
        return this.getEstudianteIdOrFail().pipe(
            switchMap(estudianteId => {
                const url = `${this.apiUrl}/favoritos/estudiante/${estudianteId}/alojamiento/${alojamientoId}`;
                // El endpoint DELETE retorna HttpStatus.NO_CONTENT (204)
                return this.http.delete<void>(url);
            })
        );
    }

    // NUEVO: Función de conveniencia para añadir o eliminar
    toggleFavoriteStatus(alojamientoId: number, isCurrentlyFavorite: boolean): Observable<any> {
        if (isCurrentlyFavorite) {
            // Si es favorito, lo elimina
            return this.removeFavorite(alojamientoId);
        } else {
            // Si no es favorito, lo añade
            return this.addFavorite(alojamientoId);
        }
    }

    cancelRequest(requestId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/solicitudes/${requestId}`);
    }

}
