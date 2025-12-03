import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AlojamientoResponse,
  AlojamientoRequestForm,
  AccommodationCardViewModel,
  AccommodationDetailViewModel
} from '../models/accommodation.models';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alojamientos`;

  /**
   * Obtiene todas las tarjetas de alojamiento (sin filtros)
   */
  getAllCards(): Observable<AccommodationCardViewModel[]> {
    return this.http.get<AlojamientoResponse[]>(this.apiUrl).pipe(
      map(dtos => dtos.map(dto => this.mapToCard(dto)))
    );
  }


  /**
   * 👇 MÉTODO AGREGADO: Filtrado de alojamientos en el cliente
   * (Nota: Idealmente esto se haría en el backend, pero mantenemos la lógica actual)
   */
  filterAccommodations(filters: { district?: string, university?: string, minPrice?: number, maxPrice?: number }): Observable<AccommodationCardViewModel[]> {
    return this.http.get<AlojamientoResponse[]>(this.apiUrl).pipe(
      map(dtos => {
        let filtered = dtos;

        // Filtro por distrito
        if (filters.district && filters.district !== 'Todos') {
          filtered = filtered.filter(dto => dto.distrito === filters.district);
        }

        // Filtro por universidad (array contains)
        if (filters.university && filters.university !== 'Todas') {
          filtered = filtered.filter(dto => dto.universidades?.includes(filters.university!));
        }

        // Filtro por precio mínimo
        if (filters.minPrice != null) {
          filtered = filtered.filter(dto => dto.precioMensual >= filters.minPrice!);
        }

        // Filtro por precio máximo
        if (filters.maxPrice != null) {
          filtered = filtered.filter(dto => dto.precioMensual <= filters.maxPrice!);
        }

        // Mapear a ViewModels
        return filtered.map(dto => this.mapToCard(dto));
      })
    );
  }

  getAccommodationDetail(id: number): Observable<AccommodationDetailViewModel> {
    return this.http.get<AlojamientoResponse>(`${this.apiUrl}/${id}`).pipe(
      map(dto => ({
        ...dto,
        formattedDate: new Date(dto.fecha).toLocaleDateString(),
        googleMapsUrl: `https://maps.google.com/?q=${dto.latitud},${dto.longitud}`,
        securityLevelLabel: 'Normal' // Mock
      }))
    );
  }

  createAccommodation(data: AlojamientoRequestForm): Observable<AlojamientoResponse> {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('direccion', data.direccion);
    formData.append('precioMensual', data.precioMensual.toString());
    formData.append('nroPartida', data.nroPartida);
    formData.append('alquilado', data.alquilado.toString());
    formData.append('propietarioId', data.propietarioId.toString());
    formData.append('distritoId', data.distritoId.toString());

    // Arrays
    if (data.transportes) {
      data.transportes.forEach((t, i) => formData.append(`transportes[${i}]`, t));
    }
    if (data.universidadesIds) {
      data.universidadesIds.forEach((id, i) => formData.append(`universidadesIds[${i}]`, id.toString()));
    }

    // Archivos
    data.imagenes.forEach(file => formData.append('imagenes', file));

    return this.http.post<AlojamientoResponse>(this.apiUrl, formData);
  }

  updateAccommodation(id: number, data: AlojamientoRequestForm): Observable<AlojamientoResponse> {
    const payload = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      direccion: data.direccion,
      precioMensual: data.precioMensual,
      nroPartida: data.nroPartida,
      alquilado: data.alquilado,
      propietarioId: data.propietarioId,
      distritoId: data.distritoId,
      transportes: data.transportes,
      universidadesIds: data.universidadesIds,
      habitaciones: data.habitaciones,
      banios: data.banios,
      area: data.area,
      piso: data.piso
    };

    return this.http.put<AlojamientoResponse>(`${this.apiUrl}/${id}`, payload);
  }

  getThumbnailUrl(id: number): Observable<string> {
    return this.getAccommodationDetail(id).pipe(
      map(dto => dto.imagenes?.[0]?.url || 'assets/placeholder.jpg')
    );
  }

  // Utilidad de mapeo interno para reutilizar lógica
  private mapToCard(dto: AlojamientoResponse): AccommodationCardViewModel {
    return {
      id: dto.id,
      title: dto.titulo,
      price: dto.precioMensual,
      district: dto.distrito,
      thumbnailUrl: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
      isFavorite: false, // Este estado se gestiona/sobreescribe en el componente o StudentService
      description: dto.descripcion,
      universityNear: dto.universidades?.[0], // Primera universidad como referencia
      area: dto.area,
      baths: dto.banios,
      rooms: dto.habitaciones,
      isFeatured: false
    };
  }
}
