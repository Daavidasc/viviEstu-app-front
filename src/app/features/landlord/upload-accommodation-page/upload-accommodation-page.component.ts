import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordNavbarComponent } from '../../../shared/components/landlord-navbar/landlord-navbar.component';
import { FooterComponent } from './../../../shared/components/footer';
import { AccommodationFormComponent } from '../components/accommodation-form/accommodation-form.component';

@Component({
  selector: 'app-upload-accommodation-page',
  standalone: true,
  imports: [CommonModule, LandlordNavbarComponent, FooterComponent, AccommodationFormComponent],
  templateUrl: './upload-accommodation-page.component.html',
  styleUrls: ['./upload-accommodation-page.component.css']
})
export class UploadAccommodationPageComponent {
}
