import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstudianteProfileResponse } from '../models/auth.models';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../models/ui-view.models';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    private currentStudent: StudentProfileViewModel = {
        id: 101,
        nombre: 'Henry Antonio',
        apellidos: 'Mendoza',
        name: 'Henry Antonio Mendoza',
        correo: 'u202212345@upc.edu.pe',
        dni: '74325432',
        telefono: '987 654 321',
        distrito: 'Monterrico',
        universidad: 'UPC Monterrico',
        ciclo: 6,
        carrera: 'Ciencias de la Computacion',
        district: 'Monterrico',
        university: 'UPC Monterrico',
        age: 22,
        preferredZone: 'Monterrico',
        budget: 1500
    };

    private mockFavorites: AccommodationCardViewModel[] = [
        {
            id: 1,
            thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 650,
            district: 'Monterrico',
            title: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.',
            isFavorite: true,
            score: 4.5,
            date: new Date()
        },
        {
            id: 2,
            thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 1200,
            district: 'Monterrico',
            title: 'Moderno loft con vista a parque, zona segura.',
            isFavorite: true,
            score: 4.8,
            date: new Date()
        },
        {
            id: 3,
            thumbnailUrl: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            price: 950,
            district: 'Monterrico',
            title: 'Minidepartamento amoblado, incluye servicios.',
            isFavorite: true,
            score: 4.2,
            date: new Date()
        }
    ];

    private mockRequests: StudentRequestViewModel[] = [
        {
            requestId: 101,
            thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            price: 650,
            district: 'Monterrico',
            status: 'Pendiente',
            statusColor: 'yellow'
        }
    ];

    constructor() { }

    getProfile(): Observable<StudentProfileViewModel> {
        return of(this.currentStudent);
    }

    updateProfile(profile: StudentProfileViewModel): Observable<StudentProfileViewModel> {
        this.currentStudent = { ...this.currentStudent, ...profile };
        return of(this.currentStudent);
    }

    getFavorites(): Observable<AccommodationCardViewModel[]> {
        return of(this.mockFavorites);
    }

    getRequests(): Observable<StudentRequestViewModel[]> {
        return of(this.mockRequests);
    }
}
