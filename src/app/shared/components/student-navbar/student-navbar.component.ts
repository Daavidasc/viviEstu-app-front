import { AuthService } from './../../../core/services/auth.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentProfile } from '../../../core/models/student.models';


@Component({
  selector: 'app-student-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-navbar.component.html',
  styleUrls: ['./student-navbar.component.css']
})
export class StudentNavbarComponent {
  @Input() currentUser: StudentProfile | null = null;
  imageLoadError = false;

  constructor(private authService: AuthService) {}

  handleImageError() {
    this.imageLoadError = true;
  }
  logout() {
 // Llama al método de tu servicio para cerrar sesión
 this.authService.logout();
 // La lógica de redirección y limpieza debe estar dentro de authService.logout()
 }
 // ---------------------------------------
}

