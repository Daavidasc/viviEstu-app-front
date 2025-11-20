import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentProfile } from '../../../../core/models/student.models';

@Component({
  selector: 'app-profile-info-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile-info-card.component.html',
  styleUrls: ['./profile-info-card.component.css']
})
export class ProfileInfoCardComponent {
  @Input() student: StudentProfile | null = null;

  // El constructor y la función editProfile() ya no son necesarios aquí.
  constructor() {}
}
