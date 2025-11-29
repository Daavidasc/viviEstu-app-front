import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs'; // Necesario para cargar múltiples peticiones

// Componentes Compartidos
import { StudentNavbarComponent } from '../../../shared/components/student-navbar/student-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

// Servicios y Modelos
import { StudentService } from '../../../core/services/student.service';
import { LocationService } from '../../../core/services/location.service'; // 👈 IMPORTANTE
import { StudentProfile } from '../../../core/models/student.models';
import { DistritoResponse, UniversidadResponse } from '../../../core/models/location.models'; // 👈 IMPORTANTE

@Component({
  selector: 'app-edit-student-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private locationService = inject(LocationService); // 👈 Inyectamos servicio de ubicación
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  studentData: StudentProfile | null = null;

  // Listas para los desplegables
  distritos: DistritoResponse[] = [];
  universidades: UniversidadResponse[] = [];

  isLoading = true;
  isSaving = false;

  ngOnInit() {
    // Cargamos todo en paralelo: Perfil + Catálogos
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Usamos forkJoin para esperar a que TODO (perfil, distritos y universidades) esté listo
    forkJoin({
      profile: this.studentService.getProfile(),
      distritos: this.locationService.getAllDistricts(),
      universidades: this.locationService.getAllUniversities()
    }).subscribe({
      next: (data) => {
        this.studentData = { ...data.profile };
        this.distritos = data.distritos;
        this.universidades = data.universidades;

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando datos', err);
        this.isLoading = false;
        // Si falla algo crítico, redirigimos o mostramos error
        // this.router.navigate(['/student/profile']);
      }
    });
  }

  onSubmit() {
    if (!this.studentData) return;

    this.isSaving = true;

    const payload = {
      nombre: this.studentData.nombre,
      apellidos: this.studentData.apellidos,
      telefono: this.studentData.telefono,
      carrera: this.studentData.carrera,
      ciclo: this.studentData.ciclo,
      dni: this.studentData.dni,
      distritoId: this.studentData.distritoId,
      universidadId: this.studentData.universidadId
    };

    console.log('Enviando payload:', payload);

    this.studentService.updateProfile(payload).subscribe({
      next: () => {
        console.log('Perfil actualizado');
        this.isSaving = false;
        this.router.navigate(['/student/profile']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.isSaving = false;
        alert('Hubo un error al actualizar el perfil.');
      }
    });
  }
}
