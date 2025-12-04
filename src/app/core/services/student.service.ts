import { StudentProfile } from './../models/student.models';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


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
  private interactionService = inject(InteractionService);
  private apiUrl = `${environment.apiUrl}`;

  // === PERFIL ===
  getProfile(): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/estudiantes/me`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/estudiantes/me`, profileData);
  }

  // === DASHBOARD & ALOJAMIENTOS ===
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

  // === FAVORITOS ===
  getFavorites(): Observable<FavoritoResponse[]> {
    return this.getProfile().pipe(
      switchMap(profile =>
        this.http.get<FavoritoResponse[]>(`${this.apiUrl}/favoritos/estudiante/${profile.id}`)
      )
    );
  }

  // === SOLICITUDES ===
  getMyRequests(): Observable<RequestViewModel[]> {
    return this.getProfile().pipe(
      switchMap(profile =>
        this.http.get<SolicitudResponse[]>(`${this.apiUrl}/solicitudes/estudiante/${profile.id}`)
      ),
      switchMap(requests => {
        if (requests.length === 0) return of([]);

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
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      return of(Number(storedId));
    }
    return this.getProfile().pipe(
      map(profile => profile.id),
      tap(id => localStorage.setItem('studentId', id.toString()))
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
      subtitle: req.tituloAlojamiento,
      image: imgUrl,
      status: req.estado,
      statusColor: color,
      price: req.oferta
    };
  }
}
