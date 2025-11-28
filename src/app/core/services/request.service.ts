import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SolicitudRequest } from '../models/request.models';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  sendRequest(data: SolicitudRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateStatus(requestId: number, status: 'ACEPTADO' | 'RECHAZADO'): Observable<void> {
    const endpoint = status === 'ACEPTADO' ? 'aceptar' : 'rechazar';
    return this.http.put<void>(`${this.apiUrl}/${requestId}/${endpoint}`, {});
  }

  cancelRequest(requestId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${requestId}`);
  }
}
