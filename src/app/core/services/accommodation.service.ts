import { Injectable } from '@angular/core';
import { Accommodation } from '../models/student.models';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccommodationService {

    private allAccommodations: Accommodation[] = [
        { id: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 650, district: 'Monterrico', description: 'Amplio y cómodo departamento cerca a la UPC Monterrico y ESAN. Ideal para compartir.', area: 80, baths: 1, rooms: 1, isFavorite: false, universityNear: 'UPC Monterrico', isFeatured: true },
        { id: 2, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 1200, district: 'Monterrico', description: 'Moderno loft con vista a parque, zona segura. Incluye vigilancia.', area: 92, baths: 1, rooms: 2, isFavorite: true, universityNear: 'UPC Monterrico', isFeatured: false },
        { id: 3, image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 950, district: 'Monterrico', description: 'Minidepartamento amoblado, incluye servicios de agua y luz.', area: 45, baths: 1, rooms: 1, isFavorite: false, universityNear: 'UPC Monterrico', isFeatured: false },
        { id: 4, image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 800, district: 'San Borja', description: 'Habitación con baño propio, entrada independiente.', area: 30, baths: 1, rooms: 1, isFavorite: false, universityNear: 'Universidad de Lima', isFeatured: false },
        { id: 5, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 1200, district: 'Surco', description: 'Cerca a Caminos del Inca, fácil acceso a transporte público.', area: 70, baths: 2, rooms: 2, isFavorite: false, universityNear: 'Ricardo Palma', isFeatured: false },
        { id: 6, image: 'https://images.unsplash.com/photo-1556912173-3db9963ee790?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 650, district: 'Monterrico', description: 'Roommate buscado para departamento compartido.', area: 100, baths: 2, rooms: 3, isFavorite: false, universityNear: 'UPC Monterrico', isFeatured: false }
    ];

    constructor() { }

    getAccommodations(): Observable<Accommodation[]> {
        return of(this.allAccommodations);
    }

    getAccommodationsByDistrict(district: string): Observable<Accommodation[]> {
        const filtered = this.allAccommodations.filter(item => item.district === district);
        return of(filtered);
    }

    getAccommodationsByUniversity(university: string): Observable<Accommodation[]> {
        const filtered = this.allAccommodations.filter(item => item.universityNear === university);
        return of(filtered);
    }

    toggleFavorite(id: number): void {
        const accommodation = this.allAccommodations.find(a => a.id === id);
        if (accommodation) {
            accommodation.isFavorite = !accommodation.isFavorite;
        }
    }

    filterAccommodations(filters: { district?: string, university?: string, minPrice?: number, maxPrice?: number }): Observable<Accommodation[]> {
        let filtered = this.allAccommodations;

        if (filters.district && filters.district !== 'Todos') {
            filtered = filtered.filter(item => item.district === filters.district);
        }

        if (filters.university && filters.university !== 'Todas') {
            filtered = filtered.filter(item => item.universityNear === filters.university);
        }

        if (filters.minPrice) {
            filtered = filtered.filter(item => item.price >= filters.minPrice!);
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(item => item.price <= filters.maxPrice!);
        }

        return of(filtered);
    }
}
