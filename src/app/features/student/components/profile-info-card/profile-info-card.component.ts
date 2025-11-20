import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // RouterModule es necesario para routerLink
import { StudentProfile } from '../../../../core/models/student.models';

@Component({
  selector: 'app-profile-info-card',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegurarse de que RouterModule esté en los imports
  templateUrl: './profile-info-card.component.html',
  styleUrls: ['./profile-info-card.component.css']
})
export class ProfileInfoCardComponent {
  @Input() student: StudentProfile | null = null;

  // El constructor y la función editProfile() ya no son necesarios aquí.
  constructor() {}
}
