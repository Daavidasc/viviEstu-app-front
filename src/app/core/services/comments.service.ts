import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ComentarioRequest, ComentarioResponse } from '../models/interaction.models'

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    constructor() { }

    addComment(comment: ComentarioRequest): Observable<ComentarioResponse> {
        return this.http.post<ComentarioResponse>(`${this.apiUrl}/comentarios`, comment);
    }

    getAllComments(): Observable<ComentarioResponse[]> {
        return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/comentarios`);
    }

    getCommentsByAccommodation(alojamientoId: number): Observable<ComentarioResponse[]> {
        return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/comentarios/alojamiento/${alojamientoId}`);
    }

    getCommentById(id: number): Observable<ComentarioResponse> {
        return this.http.get<ComentarioResponse>(`${this.apiUrl}/comentarios/${id}`);
    }

    updateComment(id: number, comment: ComentarioRequest): Observable<ComentarioResponse> {
        return this.http.put<ComentarioResponse>(`${this.apiUrl}/comentarios/${id}`, comment);
    }

    deleteComment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/comentarios/${id}`);
    }
}