import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EditProfileFormComponent } from '../components/edit-profile-form/edit-profile-form.component';
import { LandlordProfile } from '../../../core/models/landlord.models';

@Component({
  selector: 'app-edit-landlord-profile-page',
  standalone: true,
  imports: [CommonModule, LandlordNavbarComponent, FooterComponent, EditProfileFormComponent],
  templateUrl: './edit-landlord-profile-page.component.html',
  styleUrls: ['./edit-landlord-profile-page.component.css']
})
export class EditLandlordProfilePageComponent {
  landlord: LandlordProfile = {
    fullName: 'Henry Antonio Mendoza',
    email: 'hmendoza@propiedades.com',
    dni: '74325432',
    phone: '987 654 321',
    age: 45,
    address: 'Surco, Lima',
    propertiesCount: 3
  };
}
