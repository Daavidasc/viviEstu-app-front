import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { Router, RouterModule } from '@angular/router';

// Componentes Compartidos
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios y Modelos
import { StudentService } from '../../../core/services/student.service';
import { StudentProfile } from '../../../core/models/student.models';

@Component({
  selector: 'app-edit-student-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // 👈 VITAL para que funcione el formulario
    RouterModule,
    StudentNavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './edit-student-profile-page.component.html',
  styleUrls: ['./edit-student-profile-page.component.css']
})
export class EditStudentProfilePageComponent implements OnInit {

  private studentService = inject(StudentService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  studentData: StudentProfile | null = null;
  isLoading = true;
  isSaving = false;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.studentService.getProfile().subscribe({
      next: (data) => {

        this.studentData = { ...data };
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
        this.isLoading = false;
        this.router.navigate(['/student/profile']);
      }
    });
  }

onSubmit() {
  if (!this.studentData) return;

  this.isSaving = true;

  // CONSTRUIMOS EL PAYLOAD EXACTO
  // Creamos un objeto nuevo solo con lo que pide el backend
  const payload = {
    nombre: this.studentData.nombre,
    apellidos: this.studentData.apellidos,
    telefono: this.studentData.telefono,
    carrera: this.studentData.carrera,
    ciclo: this.studentData.ciclo,
    dni: this.studentData.dni,

    // Aquí asignamos los valores de los inputs numéricos que creamos
    // Asegúrate de que en el HTML el ngModel sea studentData.distritoId y studentData.universidadId
    distritoId: this.studentData.distritoId,
    universidadId: this.studentData.universidadId
  };

  console.log('Enviando payload limpio:', payload);

  this.studentService.updateProfile(payload).subscribe({
    next: () => {
      console.log('Perfil actualizado');
      this.isSaving = false;
      this.router.navigate(['/student/profile']);
    },
    error: (err) => {
      console.error('Error al actualizar:', err);
      this.isSaving = false;
      alert('Hubo un error. Revisa la consola para ver detalles.');
    }
  });
}
}
