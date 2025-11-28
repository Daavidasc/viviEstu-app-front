import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LandlordProfileViewModel } from '../../../../core/models/landlord.models';


@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css']
})
export class EditProfileFormComponent {
  @Input() landlord!: LandlordProfileViewModel;

  onSubmit() {
    console.log('Guardando cambios:', this.landlord);
    alert('Perfil actualizado exitosamente');
    // Aquí iría la lógica para llamar al servicio de backend
  }
}
