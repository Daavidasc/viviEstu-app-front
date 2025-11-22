import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationCardViewModel, StudentRequestViewModel, StudentProfileViewModel } from '../models/ui-view.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstudianteProfileResponse } from '../models/auth.models';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;
    private currentStudent: StudentProfileViewModel | null = null;
    constructor() { }

    getProfile(): Observable<StudentProfileViewModel> {
        return this.http.get<StudentProfileViewModel>(`${this.apiUrl}/estudiantes/me`);
    }

    updateProfile(profile: StudentProfileViewModel): Observable<StudentProfileViewModel> {
        this.currentStudent = { ...this.currentStudent, ...profile };
        return this.http.put<StudentProfileViewModel>(`${this.apiUrl}/estudiantes/me`, profile);
    }

    getFavorites(): Observable<AccommodationCardViewModel[]> {
        return this.http.get<AccommodationCardViewModel[]>(`${this.apiUrl}/estudiantes/favoritos`);
    }

    getRequests(): Observable<StudentRequestViewModel[]> {
        return this.http.get<StudentRequestViewModel[]>(`${this.apiUrl}/estudiantes/solicitudes`);
    }

    getProfileId(): Observable<number> {
        return this.http.get<EstudianteProfileResponse>(`${this.apiUrl}/estudiantes/me`).pipe(map(response => response.id));
    }
}
