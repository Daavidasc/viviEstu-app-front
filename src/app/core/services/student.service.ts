import { Injectable } from '@angular/core';
import { StudentProfile, Accommodation, ActiveRequest } from '../models/student.models';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    private currentStudent: StudentProfile = {
        id: 101,
        name: 'Henry', // Used in dashboard
        fullName: 'Henry Antonio Mendoza', // Used in profile
        email: 'u202212345@upc.edu.pe',
        dni: '74325432',
        phone: '987 654 321',
        age: 20,
        preferredZone: 'Surco',
        preferredDistrict: 'Monterrico', // Used in dashboard
        budget: 'S/. 1000 - S/. 1500',
        university: 'UPC Monterrico',
        semester: 6,
        career: 'Ciencias de la Computacion',
        avatarUrl: 'assets/avatar.png' // Used in dashboard
    };

    private favorites: Accommodation[] = [
        { id: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 650, district: 'Monterrico', description: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', area: 80, baths: 1, rooms: 1, isFavorite: true },
        { id: 2, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 1200, district: 'Monterrico', description: 'Moderno loft con vista a parque, zona segura.', area: 92, baths: 1, rooms: 2, isFavorite: true },
        { id: 3, image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 950, district: 'Monterrico', description: 'Minidepartamento amoblado, incluye servicios.', area: 45, baths: 1, rooms: 1, isFavorite: true }
    ];

    private requests: ActiveRequest[] = [
        { id: 101, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', price: 650, district: 'Monterrico', status: 'Pendiente' }
    ];

    constructor() { }

    getProfile(): Observable<StudentProfile> {
        return of(this.currentStudent);
    }

    updateProfile(profile: StudentProfile): Observable<StudentProfile> {
        this.currentStudent = { ...this.currentStudent, ...profile };
        return of(this.currentStudent);
    }

    getFavorites(): Observable<Accommodation[]> {
        return of(this.favorites);
    }

    getRequests(): Observable<ActiveRequest[]> {
        return of(this.requests);
    }
}
