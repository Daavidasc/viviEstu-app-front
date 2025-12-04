import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ComentarioRequest,
  ComentarioResponse,
  FavoritoResponse,
  InteractionRequest
} from '../models/interaction.models';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // === COMENTARIOS ===
  addComment(data: ComentarioRequest): Observable<ComentarioResponse> {
    return this.http.post<ComentarioResponse>(`${this.apiUrl}/comentarios`, data);
  }

  getCommentsByAccommodation(alojamientoId: number): Observable<ComentarioResponse[]> {
    return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/comentarios/alojamiento/${alojamientoId}`);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comentarios/${id}`);
  }

  // === FAVORITOS (Acciones) ===
  addFavorite(estudianteId: number, alojamientoId: number): Observable<FavoritoResponse> {
    return this.http.post<FavoritoResponse>(
      `${this.apiUrl}/favoritos/estudiante/${estudianteId}/alojamiento/${alojamientoId}`,
      {}
    );
  }

  removeFavorite(estudianteId: number, alojamientoId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/favoritos/estudiante/${estudianteId}/alojamiento/${alojamientoId}`
    );
  }

  // Helper para alternar estado
  toggleFavorite(estudianteId: number, alojamientoId: number, isCurrentlyFavorite: boolean): Observable<any> {
    return isCurrentlyFavorite
      ? this.removeFavorite(estudianteId, alojamientoId)
      : this.addFavorite(estudianteId, alojamientoId);
  }

  addInteraction(interactionRequest: InteractionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/interacciones`, interactionRequest);
  }
}
