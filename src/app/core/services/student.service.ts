import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Modelos nuevos
import { EstudianteProfileResponse, StudentProfileViewModel } from '../models/student.models';
import { AccommodationCardViewModel } from '../models/accommodation.models';
import { SolicitudResponse, RequestViewModel } from '../models/request.models';
import { FavoritoResponse } from '../models/interaction.models';

import { AccommodationService } from './accommodation.service';
import { InteractionService } from './interaction.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private accommodationService = inject(AccommodationService);
  private interactionService = inject(InteractionService); // Usamos el nuevo servicio de interacción
  private apiUrl = `${environment.apiUrl}`;

  // === PERFIL ===
  getProfile(): Observable<EstudianteProfileResponse> {
    return this.http.get<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`);
  }

  getViewProfile(): Observable<StudentProfileViewModel> {
    return this.getProfile().pipe(
      map(profile => ({
        ...profile,
        fullName: `${profile.nombre} ${profile.apellidos}`,
        university: profile.universidad,
        district: profile.distrito,
        avatarUrl: profile.urlFotoPerfil || 'assets/images/avatar-placeholder.png',
        // Mock data para campos no existentes aun
        age: 20,
        preferredZone: profile.distrito,
        budget: 0
      }))
    );
  }

  updateProfile(profile: EstudianteProfileResponse): Observable<EstudianteProfileResponse> {
    return this.http.put<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`, profile);
  }

  // === DASHBOARD & ALOJAMIENTOS ===
  /**
   * Obtiene todos los alojamientos y marca los que son favoritos del usuario actual.
   */
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

  // === FAVORITOS (Delegación) ===
  getFavorites(): Observable<FavoritoResponse[]> {
    return this.getProfile().pipe(
      switchMap(profile => this.http.get<FavoritoResponse[]>(`${this.apiUrl}/favoritos/estudiante/${profile.id}`))
    );
  }

  // === SOLICITUDES (Mis postulaciones) ===
  getMyRequests(): Observable<RequestViewModel[]> {
    return this.getProfile().pipe(
      switchMap(profile => this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/estudiante/${profile.id}`)),
      switchMap(requests => {
        if (requests.length === 0) return of([]);

        // Mapeamos cada solicitud para obtener la imagen del alojamiento
        const tasks = requests.map(req =>
          this.accommodationService.getThumbnailUrl(req.alojamientoId).pipe(
            map(url => this.mapToRequestViewModel(req, url)),
            catchError(() => of(this.mapToRequestViewModel(req, 'assets/placeholder.jpg')))
          )
        );
        return forkJoin(tasks);
      })
    );
  }

  getProfileId(): Observable<number> {
    return this.getProfile().pipe(
      map(profile => profile.id)
    );
  }

  private mapToRequestViewModel(req: SolicitudResponse, imgUrl: string): RequestViewModel {
    let color: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
    if (req.estado === 'ACEPTADO') color = 'green';
    else if (req.estado === 'PENDIENTE') color = 'yellow';
    else if (req.estado === 'RECHAZADO') color = 'red';

    return {
      requestId: req.id,
      accommodationId: req.alojamientoId,
      title: req.tituloAlojamiento || 'Alojamiento',
      subtitle: req.tituloAlojamiento, // Podrías mapear el distrito si el backend lo enviara en el DTO de solicitud
      image: imgUrl,
      status: req.estado,
      statusColor: color,
      price: req.oferta
    };
  }
}
