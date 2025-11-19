import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { AccommodationCardComponent } from '../components/accommodation-card/accommodation-card.component'; // Importación cambiada
import { RequestCardComponent } from '../components/request-card/request-card.component';
import { StudentProfile, Accommodation, ActiveRequest } from '../../../core/models/student.models';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, ProfileInfoCardComponent, AccommodationCardComponent, RequestCardComponent], // Componente cambiado
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  student: StudentProfile = {
    fullName: 'Henry Antonio Mendoza',
    email: 'u202212345@upc.edu.pe',
    dni: '74325432',
    phone: '987 654 321',
    age: 20,
    preferredZone: 'Surco',
    budget: 'S/. 1000 - S/. 1500',
    university: 'UPC Monterrico',
    semester: 6,
    career: 'Ciencias de la Computacion'
  };

  favorites: Accommodation[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 650, district: 'Monterrico', description: 'Amplio y comodo departamento cerca a la UPC monterrico y ESAN.', area: 80, baths: 1, rooms: 1, isFavorite: true },
    { id: 2, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 1200, district: 'Monterrico', description: 'Moderno loft con vista a parque, zona segura.', area: 92, baths: 1, rooms: 2, isFavorite: true },
    { id: 3, image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', price: 950, district: 'Monterrico', description: 'Minidepartamento amoblado, incluye servicios.', area: 45, baths: 1, rooms: 1, isFavorite: true }
  ];

  requests: ActiveRequest[] = [
    { id: 101, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', price: 650, district: 'Monterrico', status: 'Pendiente' }
  ];

  ngOnInit() {}
}
