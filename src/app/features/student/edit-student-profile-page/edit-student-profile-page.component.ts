import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EditStudentProfileFormComponent } from '../components/edit-student-profile-form/edit-student-profile-form.component';
import { StudentProfile } from '../../../core/models/student.models';

@Component({
  selector: 'app-edit-student-profile-page',
  standalone: true,
  imports: [CommonModule, StudentNavbarComponent, FooterComponent, EditStudentProfileFormComponent],
  templateUrl: './edit-student-profile-page.component.html',
  styleUrls: ['./edit-student-profile-page.component.css']
})
export class EditStudentProfilePageComponent implements OnInit {
  student!: StudentProfile;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { studentData: StudentProfile };
    if (state?.studentData) {
      this.student = state.studentData;
    }
  }

  ngOnInit(): void {
    // Si el estudiante no fue pasado por el state (ej. recarga de página)
    if (!this.student) {
      // Cargamos los datos del perfil aquí.
      // En un futuro, esto vendría de un servicio: this.userService.getProfile().
      this.student = {
        fullName: 'Henry Antonio Mendoza',
        email: 'u202212345@upc.edu.pe',
        dni: '74325432',
        phone: '987 654 321',
        age: 20,
        preferredZone: 'Surco',
        budget: '1250',
        university: 'UPC Monterrico',
        semester: 6,
        career: 'Ciencias de la Computacion'
      };
    }
  }
}
