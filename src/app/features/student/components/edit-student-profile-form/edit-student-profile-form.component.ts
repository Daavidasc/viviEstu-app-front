import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentProfile } from '../../../../core/models/student.models';

@Component({
  selector: 'app-edit-student-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-student-profile-form.component.html',
  styleUrls: ['./edit-student-profile-form.component.css']
})
export class EditStudentProfileFormComponent {
  @Input() student!: StudentProfile;

  onSubmit() {
    console.log('Guardando cambios:', this.student);
    alert('Perfil de estudiante actualizado exitosamente');
    // Aquí iría la lógica para llamar al servicio de backend y guardar los datos
  }
}
