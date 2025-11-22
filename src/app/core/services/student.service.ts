import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../models/ui-view.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstudianteProfileResponse } from '../models/auth.models';
import { FavoritoResponse, SolicitudResponse } from '../models/interaction.models';
import { AlojamientoResponse } from '../models/accommodation.models';
import { map, switchMap } from 'rxjs/operators';
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

    getFavorites(): Observable<FavoritoResponse[]> {//SOLUCIONAR
        return this.http.get<FavoritoResponse[]>(`${this.apiUrl}/favoritos/estudiante/${this.currentStudent?.id}`);
    }

    getAllFavoriteAccommodations(): Observable<AlojamientoResponse[]> {
        return this.getFavorites().pipe(
            switchMap(favorites => {
                if (!favorites || favorites.length === 0) {
                    return of([]);
                }
                const requests = favorites.map(fav =>
                    this.accommodationService.getAccommodationDetail(fav.alojamientoId)
                );
                return forkJoin(requests).pipe(
                    map(details => details.filter(d => d !== null) as AlojamientoResponse[])
                );
            })
        );
    }

    isFavorite(id: number): Observable<boolean> {
        return this.getFavorites().pipe(
            map(favorites => favorites.some(fav => fav.alojamientoId === id))
        );
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

    getRequests(): Observable<StudentRequestViewModel[]> {//SOLUCIONAR
        return this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/estudiante/${this.currentStudent?.id}`).pipe(
            map(requests => requests.map(req => this.mapToRequestViewModel(req)))
        );
    }

    private mapToRequestViewModel(request: SolicitudResponse): StudentRequestViewModel {
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
            thumbnailUrl: 'assets/placeholder.jpg', // Placeholder as image is not in response
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

}
