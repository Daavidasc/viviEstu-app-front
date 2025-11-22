import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlojamientoRequestForm, AlojamientoResponse } from '../models/accommodation.models';
import { AccommodationCardViewModel, AccommodationDetailViewModel } from '../models/ui-view.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccommodationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/alojamientos`;
    // Endpoint hipotético para subir imágenes si el backend lo provee, 
    // o URL directa de Cloudinary
    private uploadUrl = `${environment.apiUrl}/media/upload`;

    constructor() { }

    // Obtener Cards para el listado (Mapper)
    getAllCards(): Observable<AccommodationCardViewModel[]> {
        return this.http.get<AlojamientoResponse[]>(this.apiUrl).pipe(
            map(dtos => dtos.map(dto => ({
                id: dto.id,
                title: dto.titulo,
                price: dto.precioMensual,
                district: dto.distrito,
                thumbnailUrl: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
                isFavorite: false, // Logic handled in StudentService or Component
                score: 4.5, // Mock
                description: dto.descripcion,
                isFeatured: false, // Mock
                universityNear: dto.universidades?.[0], // Take first university
                area: dto.area,
                baths: dto.banios,
                rooms: dto.habitaciones
            } as AccommodationCardViewModel)))
        );
    }

    // Obtener Detalle (Mapper)
    getAccommodationDetail(id: number): Observable<AccommodationDetailViewModel | null> {
        return this.http.get<AlojamientoResponse>(`${this.apiUrl}/${id}`).pipe(
            map(dto => {
                const viewModel: AccommodationDetailViewModel = {
                    ...dto,
                    securityLevelLabel: 'Alta', // Mock logic based on district
                    googleMapsUrl: `https://maps.google.com/?q=${dto.latitud},${dto.longitud}`,
                    formattedDate: new Date(dto.fecha).toLocaleDateString()
                };
                return viewModel;
            })
        );
    }

    // Filtros (Aplicados sobre los DTOs y luego mappeados)
    filterAccommodations(filters: { district?: string, university?: string, minPrice?: number, maxPrice?: number }): Observable<AccommodationCardViewModel[]> {
        return this.http.get<AlojamientoResponse[]>(this.apiUrl).pipe(
            map(dtos => {
                // Aplicar filtros
                let filtered = dtos;

                // Filtro por distrito
                if (filters.district && filters.district !== 'Todos') {
                    filtered = filtered.filter(dto => dto.distrito === filters.district);
                }

                // Filtro por universidad
                if (filters.university && filters.university !== 'Todas') {
                    filtered = filtered.filter(dto =>
                        dto.universidades?.includes(filters.university!)
                    );
                }

                // Filtro por precio mínimo
                if (filters.minPrice !== undefined && filters.minPrice !== null) {
                    filtered = filtered.filter(dto => dto.precioMensual >= filters.minPrice!);
                }

                // Filtro por precio máximo
                if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
                    filtered = filtered.filter(dto => dto.precioMensual <= filters.maxPrice!);
                }

                // Mapear a ViewModels
                return filtered.map(dto => ({
                    id: dto.id,
                    title: dto.titulo,
                    price: dto.precioMensual,
                    district: dto.distrito,
                    thumbnailUrl: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
                    isFavorite: false, // Mock logic
                    score: 4.5, // Mock
                    description: dto.descripcion,
                    isFeatured: false, // Mock
                    universityNear: dto.universidades?.[0], // Take first university
                    area: dto.area,
                    baths: dto.banios,
                    rooms: dto.habitaciones
                } as AccommodationCardViewModel));
            })
        );
    }

    toggleFavorite(id: number): void {
        // Mock implementation
        console.log(`Toggled favorite for accommodation ${id}`);
    }

    // Método legacy para compatibilidad temporal o refactorización de Landlord
    // Se puede mantener o adaptar
    getAccommodationPreview(id: number): Observable<any> {
        return this.getAccommodationDetail(id);
    }

    /**
     * Crea un nuevo alojamiento enviando FormData con archivos
     * Convierte AlojamientoRequestForm a multipart/form-data para el backend
     */
    createAccommodation(data: AlojamientoRequestForm): Observable<AlojamientoResponse> {
        const formData = new FormData();

        // Agregar campos simples
        formData.append('titulo', data.titulo);
        formData.append('descripcion', data.descripcion);
        formData.append('direccion', data.direccion);
        formData.append('precioMensual', data.precioMensual.toString());
        formData.append('nroPartida', data.nroPartida);
        formData.append('alquilado', data.alquilado.toString());
        formData.append('propietarioId', data.propietarioId.toString());
        formData.append('distritoId', data.distritoId.toString());

        // Agregar arrays de transportes
        data.transportes.forEach((transporte, index) => {
            formData.append(`transportes[${index}]`, transporte);
        });

        // Agregar arrays de universidades
        data.universidadesIds.forEach((universidadId, index) => {
            formData.append(`universidadesIds[${index}]`, universidadId.toString());
        });

        // Agregar archivos de imágenes
        data.imagenes.forEach((file) => {
            formData.append('imagenes', file, file.name);
        });

        // Enviar FormData al backend
        return this.http.post<AlojamientoResponse>(this.apiUrl, formData);
    }

    // Método auxiliar para subir una imagen y obtener su URL
    // Nota: Si usas Cloudinary directo desde el front, cambia la URL y params
    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>(this.uploadUrl, formData);
    }
}
