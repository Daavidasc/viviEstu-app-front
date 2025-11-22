import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComentarioRequest, ComentarioResponse } from '../models/interaction.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComentsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/comentarios`;

    constructor() { }

    /**
     * Obtener todos los comentarios de un alojamiento específico
     * GET /api/v1/comentarios/alojamiento/{alojamientoId}
     */
    getComentariosByAlojamiento(alojamientoId: number): Observable<ComentarioResponse[]> {
        return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/alojamiento/${alojamientoId}`);
    }

    /**
     * Obtener todos los comentarios de un estudiante específico
     * GET /api/v1/comentarios/estudiante/{estudianteId}
     */
    getComentariosByEstudiante(estudianteId: number): Observable<ComentarioResponse[]> {
        return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
    }

    /**
     * Obtener un comentario por ID
     * GET /api/v1/comentarios/{id}
     */
    getComentarioById(id: number): Observable<ComentarioResponse> {
        return this.http.get<ComentarioResponse>(`${this.apiUrl}/${id}`);
    }

    /**
     * Crear un nuevo comentario
     * POST /api/v1/comentarios
     */
    createComentario(comentario: ComentarioRequest): Observable<ComentarioResponse> {
        return this.http.post<ComentarioResponse>(this.apiUrl, comentario);
    }

    /**
     * Actualizar un comentario existente
     * PUT /api/v1/comentarios/{id}
     */
    updateComentario(id: number, comentario: Partial<ComentarioRequest>): Observable<ComentarioResponse> {
        return this.http.put<ComentarioResponse>(`${this.apiUrl}/${id}`, comentario);
    }

    /**
     * Eliminar un comentario
     * DELETE /api/v1/comentarios/{id}
     */
    deleteComentario(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtener la puntuación promedio de un alojamiento
     * Calcula el promedio a partir de los comentarios
     */
    getPromedioCalificacion(alojamientoId: number): Observable<number> {
        return this.getComentariosByAlojamiento(alojamientoId).pipe(
            map((comentarios: ComentarioResponse[]) => {
                if (comentarios.length === 0) {
                    return 0;
                }
                const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
                const promedio = suma / comentarios.length;
                return Math.round(promedio * 10) / 10; // Redondear a 1 decimal
            })
        );
    }

    /**
     * Obtener estadísticas de comentarios de un alojamiento
     * Calcula total, promedio y distribución de puntuaciones
     */
    getEstadisticasComentarios(alojamientoId: number): Observable<{
        total: number;
        promedio: number;
        distribucion: { [key: number]: number };
    }> {
        return this.getComentariosByAlojamiento(alojamientoId).pipe(
            map((comentarios: ComentarioResponse[]) => {
                const distribucion: { [key: number]: number } = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                };

                comentarios.forEach(c => {
                    distribucion[c.puntuacion] = (distribucion[c.puntuacion] || 0) + 1;
                });

                const total = comentarios.length;
                const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
                const promedio = total > 0 ? Math.round((suma / total) * 10) / 10 : 0;

                return {
                    total,
                    promedio,
                    distribucion
                };
            })
        );
    }
}
