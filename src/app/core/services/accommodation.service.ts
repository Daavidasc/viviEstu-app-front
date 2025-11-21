import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlojamientoResponse } from '../models/accommodation.models';
import { AccommodationCardViewModel, AccommodationDetailViewModel } from '../models/ui-view.models';

@Injectable({
    providedIn: 'root'
})
export class AccommodationService {

    private mockAccommodations: AlojamientoResponse[] = [
        {
            id: 1,
            titulo: 'Amplio y cómodo departamento',
            descripcion: 'Amplio y cómodo departamento cerca a la UPC Monterrico y ESAN. Ideal para compartir.',
            direccion: 'Jr. Alonso de Molina 1231 Monterrico',
            precioMensual: 650,
            alquilado: false,
            propietario: 'Henry Mendoza',
            distrito: 'Monterrico',
            nroPartida: '12345678',
            fecha: '2025-01-10T10:00:00',
            imagenes: [
                { id: 1, url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                { id: 2, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus', 'Taxi'],
            universidades: ['UPC Monterrico', 'ESAN'],
            latitud: -12.1,
            longitud: -77.0,
            area: 45,
            banios: 1,
            habitaciones: 2,
            servicios: ['Agua', 'Luz', 'Internet']
        },
        {
            id: 2,
            titulo: 'Moderno loft con vista a parque',
            descripcion: 'Moderno loft con vista a parque, zona segura. Incluye vigilancia.',
            direccion: 'Av. Primavera 567, San Borja',
            precioMensual: 1200,
            alquilado: false,
            propietario: 'Ana García',
            distrito: 'San Borja',
            nroPartida: '87654321',
            fecha: '2025-01-12T15:30:00',
            imagenes: [
                { id: 3, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Metropolitano', 'Corredor Rojo'],
            universidades: ['Universidad de Lima'],
            latitud: -12.11,
            longitud: -77.01,
            area: 60,
            banios: 2,
            habitaciones: 3,
            servicios: ['Agua', 'Luz', 'Internet', 'Cable']
        },
        {
            id: 3,
            titulo: 'Minidepartamento amoblado',
            descripcion: 'Minidepartamento amoblado, incluye servicios de agua y luz.',
            direccion: 'Av. Encalada 456, Surco',
            precioMensual: 950,
            alquilado: false,
            propietario: 'Carlos Perez',
            distrito: 'Surco',
            nroPartida: '11223344',
            fecha: '2025-01-14T09:00:00',
            imagenes: [
                { id: 4, url: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus'],
            universidades: ['UPC Monterrico'],
            latitud: -12.12,
            longitud: -77.02,
            area: 30,
            banios: 1,
            habitaciones: 1,
            servicios: ['Agua', 'Luz']
        },
        {
            id: 4,
            titulo: 'Departamento cerca a UPC',
            descripcion: 'Departamento amoblado cerca a UPC Monterrico. Incluye servicios básicos.',
            direccion: 'Calle Los Pinos 123, Monterrico',
            precioMensual: 850,
            alquilado: false,
            propietario: 'María Rodriguez',
            distrito: 'Monterrico',
            nroPartida: '22334455',
            fecha: '2025-01-15T11:00:00',
            imagenes: [
                { id: 5, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus', 'Taxi'],
            universidades: ['UPC Monterrico'],
            latitud: -12.095,
            longitud: -76.975,
            area: 50,
            banios: 2,
            habitaciones: 2,
            servicios: ['Agua', 'Luz', 'Internet']
        },
        {
            id: 5,
            titulo: 'Habitación en casa compartida',
            descripcion: 'Habitación amplia en casa compartida. Ambiente tranquilo y seguro.',
            direccion: 'Jr. Los Olivos 456, Monterrico',
            precioMensual: 500,
            alquilado: false,
            propietario: 'Jorge Vasquez',
            distrito: 'Monterrico',
            nroPartida: '33445566',
            fecha: '2025-01-16T14:00:00',
            imagenes: [
                { id: 6, url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus'],
            universidades: ['UPC Monterrico', 'ESAN'],
            latitud: -12.105,
            longitud: -76.98,
            area: 20,
            banios: 1,
            habitaciones: 1,
            servicios: ['Agua', 'Luz', 'Internet', 'Cable']
        },
        {
            id: 6,
            titulo: 'Estudio moderno en Monterrico',
            descripcion: 'Estudio completamente equipado. Zona segura con vigilancia.',
            direccion: 'Av. La Fontana 789, Monterrico',
            precioMensual: 1100,
            alquilado: false,
            propietario: 'Sandra Lopez',
            distrito: 'Monterrico',
            nroPartida: '44556677',
            fecha: '2025-01-17T16:30:00',
            imagenes: [
                { id: 7, url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus', 'Taxi', 'Metro'],
            universidades: ['UPC Monterrico'],
            latitud: -12.098,
            longitud: -76.973,
            area: 35,
            banios: 1,
            habitaciones: 1,
            servicios: ['Agua', 'Luz', 'Internet', 'Cable', 'Gas']
        },
        {
            id: 7,
            titulo: 'Departamento compartido 3 habitaciones',
            descripcion: 'Departamento amplio para compartir. Ideal para estudiantes.',
            direccion: 'Calle Las Magnolias 234, Monterrico',
            precioMensual: 700,
            alquilado: false,
            propietario: 'Roberto Diaz',
            distrito: 'Monterrico',
            nroPartida: '55667788',
            fecha: '2025-01-18T10:00:00',
            imagenes: [
                { id: 8, url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus', 'Corredor'],
            universidades: ['UPC Monterrico', 'ESAN'],
            latitud: -12.102,
            longitud: -76.977,
            area: 80,
            banios: 2,
            habitaciones: 3,
            servicios: ['Agua', 'Luz', 'Internet']
        },
        {
            id: 8,
            titulo: 'Mini departamento en zona universitaria',
            descripcion: 'Mini departamento cerca a la UPC. Muy bien ubicado.',
            direccion: 'Jr. Los Eucaliptos 567, Monterrico',
            precioMensual: 600,
            alquilado: false,
            propietario: 'Patricia Gomez',
            distrito: 'Monterrico',
            nroPartida: '66778899',
            fecha: '2025-01-19T12:00:00',
            imagenes: [
                { id: 9, url: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus'],
            universidades: ['UPC Monterrico'],
            latitud: -12.097,
            longitud: -76.972,
            area: 25,
            banios: 1,
            habitaciones: 1,
            servicios: ['Agua', 'Luz']
        },
        {
            id: 9,
            titulo: 'Loft premium zona universitaria',
            descripcion: 'Loft de lujo completamente amoblado. Incluye gimnasio y piscina.',
            direccion: 'Av. Javier Prado 890, Monterrico',
            precioMensual: 1500,
            alquilado: false,
            propietario: 'Luis Torres',
            distrito: 'Monterrico',
            nroPartida: '77889900',
            fecha: '2025-01-20T09:00:00',
            imagenes: [
                { id: 10, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ],
            transportes: ['Bus', 'Taxi', 'Metro'],
            universidades: ['UPC Monterrico', 'ESAN'],
            latitud: -12.094,
            longitud: -76.971,
            area: 70,
            banios: 2,
            habitaciones: 2,
            servicios: ['Agua', 'Luz', 'Internet', 'Cable', 'Gas', 'Gimnasio', 'Piscina']
        }
    ];

    constructor() { }

    // Obtener Cards para el listado (Mapper)
    getAllCards(): Observable<AccommodationCardViewModel[]> {
        return of(this.mockAccommodations).pipe(
            map(dtos => dtos.map(dto => ({
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
            } as AccommodationCardViewModel)))
        );
    }

    // Obtener Detalle (Mapper)
    getAccommodationDetail(id: number): Observable<AccommodationDetailViewModel | null> {
        const dto = this.mockAccommodations.find(a => a.id === id);
        if (!dto) return of(null);

        const viewModel: AccommodationDetailViewModel = {
            ...dto,
            securityLevelLabel: 'Alta', // Mock logic based on district
            googleMapsUrl: `https://maps.google.com/?q=${dto.latitud},${dto.longitud}`,
            formattedDate: new Date(dto.fecha).toLocaleDateString()
        };

        return of(viewModel);
    }

    // Filtros (Simulados sobre los DTOs y luego mappeados)
    filterAccommodations(filters: { district?: string, university?: string, minPrice?: number, maxPrice?: number }): Observable<AccommodationCardViewModel[]> {
        let filtered = this.mockAccommodations;

        if (filters.district && filters.district !== 'Todos') {
            filtered = filtered.filter(item => item.distrito === filters.district);
        }

        if (filters.university && filters.university !== 'Todas') {
            filtered = filtered.filter(item => item.universidades.includes(filters.university!));
        }

        if (filters.minPrice) {
            filtered = filtered.filter(item => item.precioMensual >= filters.minPrice!);
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(item => item.precioMensual <= filters.maxPrice!);
        }

        return of(filtered).pipe(
            map(dtos => dtos.map(dto => ({
                id: dto.id,
                title: dto.titulo,
                price: dto.precioMensual,
                district: dto.distrito,
                thumbnailUrl: dto.imagenes?.[0]?.url || 'assets/placeholder.jpg',
                isFavorite: false,
                description: dto.descripcion,
                isFeatured: false,
                universityNear: dto.universidades?.[0]
            } as AccommodationCardViewModel)))
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
}
