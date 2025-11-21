import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { AccommodationCardViewModel, AccommodationDetailViewModel } from '../models/ui-view.models'; // Tus ViewModels
import { AlojamientoResponseDTO, PropietariosResponseDTO } from '../models/api-response';

@Injectable({
    providedIn: 'root'
})
export class AccommodationService {
    // Reemplaza con la URL de tu API Gateway o Controller
    private apiUrl = 'http://localhost:8080/api/v1/alojamientos';

    constructor(private http: HttpClient) { }

    /**
     * Mapea AlojamientoResponseDTO a AccommodationCardViewModel
     */
    private mapToCardViewModel(dto: AlojamientoResponseDTO): AccommodationCardViewModel {
        // Asegúrate de que este mapeo coincida con tu AccommodationCardViewModel
        return {
            id: dto.id,
            title: dto.titulo,
            price: dto.precioMensual,
            district: dto.distrito,
            thumbnailUrl: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
            isFavorite: false, // Lógica de favoritos debe ser manejada por un endpoint separado
            score: 0, // No está en el DTO, mantén el mock temporalmente
            description: dto.descripcion,
            isFeatured: false, // Mock
            universityNear: dto.universidades?.[0], // Primer elemento de la lista
            area: 0, // No está en el DTO, ajusta según sea necesario
            baths: 0, // No está en el DTO, ajusta según sea necesario
            rooms: 0, // No está en el DTO, ajusta según sea necesario
        } as AccommodationCardViewModel;
    }

    /**
     * Reemplaza getAllCards() mockeado
     */
    getAllCards(): Observable<AccommodationCardViewModel[]> {
        return this.http.get<AlojamientoResponseDTO[]>(this.apiUrl).pipe(
            map(dtos => dtos.map(this.mapToCardViewModel))
        );
    }

    /**
     * Filtros (Usará buscarPorArea por defecto si no hay filtros específicos de BE)
     */
    filterAccommodations(filters: { district?: string, university?: string, minPrice?: number, maxPrice?: number }): Observable<AccommodationCardViewModel[]> {
        // Tu backend no tiene un endpoint de filtro general. Usaremos el de búsqueda por área simulada
        // o si tienes endpoints específicos por distrito/universidad, los usarías aquí:
        let url = this.apiUrl;
        let params = new HttpParams();

        if (filters.district) {
            // Asume que tienes un endpoint para buscar por nombre o ID de distrito
            url = `${this.apiUrl}/distrito-nombre/${filters.district}`;
        } else if (filters.university) {
            // Asume que tienes un endpoint para buscar por nombre o ID de universidad
             url = `${this.apiUrl}/universidad-nombre/${filters.university}`;
        }

        // Aquí debes mapear el resultado de los filtros (AlojamientoResponseDTO[]) a tus ViewModels
        return this.http.get<AlojamientoResponseDTO[]>(url, { params }).pipe(
            map(dtos => dtos.map(this.mapToCardViewModel))
        );
    }

    /**
     * Obtener detalle del alojamiento por ID
     */
    getAccommodationDetail(id: number): Observable<AccommodationDetailViewModel | null> {
        return this.http.get<AlojamientoResponseDTO>(`${this.apiUrl}/${id}`).pipe(
            map(dto => {
                // Aquí debes implementar el mapeo de AlojamientoResponseDTO a AccommodationDetailViewModel
                // Ejemplo simple (requiere más campos en tu ViewModel):
                return {
                    id: dto.id,
                    titulo: dto.titulo,
                    formattedDate: new Date(dto.fecha).toLocaleDateString(),
                    // ... mapea el resto de los campos necesarios
                } as AccommodationDetailViewModel;
            })
        );
    }

    // Implementación de toggleFavorite (debe llamar a un endpoint de tu backend si existe)
    toggleFavorite(id: number): void {
        console.log(`Llamada a API para toggled favorite para alojamiento ${id}`);
        // Ejemplo: this.http.post(`${this.apiUrl}/${id}/toggle-favorite`, {}).subscribe();
    }

    // Nuevo: Obtener datos del propietario (usando el método del backend)
    getLandlordData(alojamientoId: number): Observable<PropietariosResponseDTO> {
        return this.http.get<PropietariosResponseDTO>(`${this.apiUrl}/${alojamientoId}/propietario`);
    }

    getCardById(id: number): Observable<AccommodationCardViewModel | null> {
    // Endpoint: GET /alojamientos/{id}
    return this.http.get<AlojamientoResponseDTO>(`${this.apiUrl}/${id}`).pipe(
        map(dto => this.mapToCardViewModel(dto)) // Reutiliza el mapeador que ya tienes
        // Añadir catchError aquí si el BE devuelve 404 para un ID no encontrado
    );
}

    // Nuevo: Subir un nuevo alojamiento (usando FormData para las imágenes)
    createAlojamiento(formData: FormData): Observable<AlojamientoResponseDTO> {
        // En el backend, el DTO es enviado junto con las imágenes (MultipartFile[]).
        // La solicitud debe ser un POST de tipo 'multipart/form-data'.
        // El DTO debe estar incluido en el FormData como un objeto JSON o campos separados.
        return this.http.post<AlojamientoResponseDTO>(this.apiUrl, formData);
    }

    // Nuevo: Eliminar alojamiento
    deleteAlojamiento(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
