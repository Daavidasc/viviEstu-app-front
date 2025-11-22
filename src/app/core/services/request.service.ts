// src/app/core/services/request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SolicitudRequest } from '../models/interaction.models'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrlBase = environment.apiUrl;

  // ✅ CONCATENAR la ruta específica del controlador de Solicitudes
  private solicitudesUrl = `${this.apiUrlBase}/solicitudes`;
  // AJUSTA ESTA URL BASE A TU ENDPOINT DE SOLICITUDES EN EL BACKEND

  constructor(private http: HttpClient) { }

  /**
   * Envía una solicitud de contacto al arrendador.
   * @param request La solicitud con los datos del estudiante y alojamiento.
   */
  sendRequest(request: SolicitudRequest): Observable<any> {
    console.log('🔗 Enviando Solicitud al Backend:', request);
    // Asume que el endpoint es POST /api/solicitudes
    return this.http.post(this.solicitudesUrl, request);
  }

  deleteRequest(requestId: number): Observable<void> {
    // La URL final será: http://localhost:8090/api/v1/solicitudes/{id}
    const url = `${this.solicitudesUrl}/${requestId}`;
    console.log(`🗑️ Eliminando solicitud en: ${url}`);
    return this.http.delete<void>(url);
  }
}
