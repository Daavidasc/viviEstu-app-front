import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { LandlordProfileViewModel } from '../../../../core/models/landlord.models';


@Component({
  selector: 'app-profile-info-card',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añadir RouterModule
  templateUrl: './profile-info-card.component.html',
  styleUrls: ['./profile-info-card.component.css']
})
export class ProfileInfoCardComponent {
  @Input() landlord!: LandlordProfileViewModel;
}
