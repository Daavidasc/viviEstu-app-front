import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ProfileHeaderCardComponent } from '../components/profile-header-card/profile-header-card.component';
import { ProfileInfoCardComponent } from '../components/profile-info-card/profile-info-card.component';
import { LandlordProfileViewModel } from '../../../core/models/landlord.models';


@Component({
  selector: 'app-landlord-profile-page',
  standalone: true,
  imports: [CommonModule, LandlordNavbarComponent, FooterComponent, ProfileHeaderCardComponent, ProfileInfoCardComponent],
  templateUrl: './landlord-profile-page.component.html',
  styleUrls: ['./landlord-profile-page.component.css']
})
export class LandlordProfilePageComponent {
  landlord: LandlordProfileViewModel = {
    id: 1,
    nombre: 'Henry Antonio',
    apellidos: 'Mendoza',
    fullName: 'Henry Antonio Mendoza',
    correo: 'hmendoza@propiedades.com',
    dni: '74325432',
    telefono: '987 654 321',
    age: 45,
    address: 'Surco, Lima',
    propertiesCount: 3
  };
}
